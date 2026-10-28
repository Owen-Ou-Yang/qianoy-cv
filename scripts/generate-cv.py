"""Regenerate public/cv.pdf from the same JSON records used by the website.

Optional authoring tool: python -m pip install reportlab
Not run by npm or Cloudflare Pages. Explicitly running this overwrites cv.pdf.
"""
import json
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public' / 'cv.pdf'

def read_data(name):
    return json.loads((ROOT / 'src' / 'data' / name).read_text())

profile = read_data('profile.json')
coursework = [project for project in read_data('coursework.json') if project.get('published') is True]
projects = [project for project in read_data('projects.json') if project.get('published') is True]
research_lines = read_data('research-lines.json')
publications = read_data('publications.json')

projects_by_slug = {project['slug']: project for project in projects}
if len(projects_by_slug) != len(projects):
    raise ValueError('Published project slugs must be unique.')
assigned_slugs = [stage['slug'] for line in research_lines for stage in line['stages']]
if len(assigned_slugs) != len(set(assigned_slugs)):
    raise ValueError('Each published project must belong to exactly one research line.')
if set(assigned_slugs) != set(projects_by_slug):
    raise ValueError('Research lines must assign every published project and reference no unpublished projects.')

INK = colors.HexColor('#182d45')
BODY = colors.HexColor('#3f4c5b')
MUTED = colors.HexColor('#5a6775')
LINE = colors.HexColor('#dbe1e8')
PAGE_WIDTH = A4[0] - 100  # Document margins plus the default frame padding.
styles = {
    'name': ParagraphStyle('name', fontName='Times-Roman', fontSize=30, leading=34, textColor=INK, spaceAfter=5),
    'identity': ParagraphStyle('identity', fontName='Helvetica', fontSize=10.5, leading=15, textColor=BODY, spaceAfter=5),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=9.7, leading=13.3, textColor=BODY, spaceAfter=3),
    'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=9.7, leading=13.3, textColor=BODY, leftIndent=11, firstLineIndent=0, bulletIndent=1, spaceAfter=4),
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=10, leading=13.5, textColor=INK, spaceAfter=3),
    'section': ParagraphStyle('section', fontName='Times-Roman', fontSize=14, leading=18, textColor=INK, spaceBefore=9, spaceAfter=5, keepWithNext=True),
    'line': ParagraphStyle('line', fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=INK, spaceBefore=5, spaceAfter=4, keepWithNext=True),
    'meta': ParagraphStyle('meta', fontName='Helvetica', fontSize=8.4, leading=11.5, textColor=MUTED, spaceAfter=3),
    'date': ParagraphStyle('date', fontName='Helvetica', fontSize=8.8, leading=13.5, textColor=MUTED, alignment=2),
    'todo': ParagraphStyle('todo', fontName='Helvetica', fontSize=8.2, leading=11, textColor=colors.HexColor('#745012'), spaceAfter=3),
}
content = []

def para(text, style='body'):
    return Paragraph(text, styles[style])

def add(text, style='body'):
    content.append(para(text, style))

def e(text):
    return escape(str(text).replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', '-').replace('\u2212', '-'))

def dated_heading(title, date):
    row = Table([[para(e(title), 'title'), para(e(date), 'date')]], colWidths=[PAGE_WIDTH * .64, PAGE_WIDTH * .36], hAlign='LEFT')
    row.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0)]))
    return row

if profile['cvIsDraft']:
    add('CURRICULUM VITAE / DRAFT - TODO fields remain', 'meta')
else:
    add('CURRICULUM VITAE', 'meta')
add(e(profile['name'] or 'TODO: Full name'), 'name')
add(e(profile['identity']), 'identity')
contacts = []
if profile['email']:
    contacts.append(f'<link href="mailto:{e(profile["email"])}">{e(profile["email"])}</link>')
contacts.append(f'<link href="{e(profile["siteUrl"])}">{e(profile["domain"])}</link>')
add(' | '.join(contacts), 'meta')
if profile['github']:
    add(f'<link href="{e(profile["github"])}">{e(profile["github"].removeprefix("https://"))}</link>', 'meta')
content.extend([Spacer(1, 6), HRFlowable(width='100%', thickness=0.7, color=LINE)])

edu = profile['education']
add('Education', 'section')
content.append(dated_heading(edu['institution'] or 'TODO: Institution', edu['dates'] or 'TODO: Dates'))
add(e(edu['degree'] + ' studies | ' + edu['background']))
if edu.get('program'):
    add(e(edu['program']))

exchange = profile.get('exchangeEducation')
if exchange:
    content.append(Spacer(1, 5))
    block = [
        dated_heading(exchange['institution'], exchange['dates']),
        para(e(exchange['role'] + (' (undergraduate)' if exchange['level'] == 'Undergraduate exchange' else '') + ' | ' + exchange['term'])),
        para('Semester GPA: <b>' + e(exchange['semesterGpa']) + '</b>, ' + e(exchange['credits']) + ' credits'),
    ]
    selected = [course for course in exchange['courses'] if course.get('cvSelected')]
    course_labels = [e(course['name']) + (' - graduate level' if course['level'] == 'Graduate level' else '') + ' (' + e(course['grade']) + ')' for course in selected]
    if course_labels:
        block.append(para('<b>Selected coursework:</b> ' + '; '.join(course_labels) + '.'))
    content.append(KeepTogether(block))

add('Academic experience', 'section')
for index, entry in enumerate(profile['experience']):
    row = dated_heading(entry['role'], entry['dates'])
    block = [row, para(e(entry['institution']))]
    if entry['group']:
        block.append(para(e(entry['group'].replace(' · ', ' | ')), 'meta'))
    elif 'iSURE' in entry['role']:
        block.append(para(e(entry['description']), 'meta'))
    if entry['dateTodo']:
        block.append(para(e(entry['dateTodo']), 'todo'))
    if index < len(profile['experience']) - 1:
        block.append(Spacer(1, 5))
    content.append(KeepTogether(block))

for line_index, line in enumerate(research_lines):
    # Research lines define the hierarchy and page divisions shared with the site.
    if line_index:
        content.append(PageBreak())
    add('Selected research' + (' (continued)' if line_index else ''), 'section')
    add(e(line['title']), 'line')
    content.append(para(e(line['cvSummary'])))
    content.append(Spacer(1, 5))
    for stage in line['stages']:
        project = projects_by_slug[stage['slug']]
        if project.get('cvSelected') is False or project.get('output') or project.get('isPlaceholder'):
            continue
        # Publication citations are not inferred from project/software records.
        description = project.get('cvSummary') or project['summary']
        url = profile['siteUrl'].rstrip('/') + '/projects/' + project['slug'] + '/'
        block = [
            para(f'<link href="{e(url)}">{e(project["title"])}</link>', 'title'),
            para(e(' | '.join(value for value in [project.get('status'), project.get('date')] if value)), 'meta'),
            para(e(description)),
            Spacer(1, 4),
        ]
        content.append(KeepTogether(block))

if coursework:
    add('Selected course project', 'section')
    for project in coursework:
        title = e(project['title'])
        if project.get('repository'):
            title = f'<link href="{e(project["repository"])}">{title}</link>'
        block = [
            para(title, 'title'),
            para(e(project['course'] + ', ' + project['institution'] + ' | ' + project['term']), 'meta'),
            para(e('Instructor: ' + project['instructor']), 'meta'),
        ]
        block.extend(Paragraph(e(bullet), styles['bullet'], bulletText='\u2022') for bullet in project['bullets'])
        block.append(Spacer(1, 3))
        content.append(KeepTogether(block))

if publications:
    add('Publications & presentations', 'section')
    for output in publications:
        citation = e(output['authors']) + '. <b>' + e(output['title']) + '.</b>'
        details = [output.get(field) for field in ['venue', 'date', 'type', 'status']]
        citation += ' ' + e(' | '.join(detail for detail in details if detail))
        if output.get('url'):
            citation += f' <link href="{e(output["url"])}">Link</link>'
        add(citation)

add('Technical skills', 'section')
if profile['programmingLanguages']:
    add('<b>Programming:</b> ' + e(', '.join(profile['programmingLanguages'])))
else:
    add('TODO: Confirm programming languages to list', 'todo')
for skill in profile['skills']:
    add('<b>' + e(skill['title']) + ':</b> ' + e(skill['description']))


def footer(canvas, doc):
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(44, 23, profile['name'] + ' | ' + profile['domain'])
    canvas.drawRightString(A4[0] - 44, 23, str(doc.page))

SimpleDocTemplate(
    str(OUTPUT), pagesize=A4, rightMargin=44, leftMargin=44,
    topMargin=35, bottomMargin=38,
    title=profile['name'] + ' - Curriculum Vitae' + (' (Draft)' if profile['cvIsDraft'] else ''),
    author=profile['name'], subject=profile['identity'],
).build(content, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
