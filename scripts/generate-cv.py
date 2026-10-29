"""Generate public/cv.pdf from explicit CV selection and shared factual records.

Optional authoring tool: python -m pip install reportlab
Not run by npm or Cloudflare Pages. Explicitly running this overwrites cv.pdf.
Website project visibility and research-line order do not select CV content.
"""
import json
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public' / 'cv.pdf'


def read_data(name):
    return json.loads((ROOT / 'src' / 'data' / name).read_text())


profile = read_data('profile.json')
selection = read_data('cv.json')
coursework = read_data('coursework.json')
selected_ids = [entry['id'] for section in ['education', 'researchExperience', 'courseProjects'] for entry in selection[section]]
if len(selected_ids) != len(set(selected_ids)):
    raise ValueError('CV selection IDs must be unique.')

INK = colors.HexColor('#182d45')
BODY = colors.HexColor('#354052')
MUTED = colors.HexColor('#596575')
LINE = colors.HexColor('#dce2e8')
PAGE_WIDTH = A4[0] - 100  # 44pt margins and the document frame's default padding.
styles = {
    'name': ParagraphStyle('name', fontName='Times-Roman', fontSize=29, leading=34, textColor=INK, spaceAfter=5),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10.2, leading=14, textColor=BODY, spaceAfter=3),
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=INK, spaceAfter=3),
    'topic': ParagraphStyle('topic', fontName='Helvetica-Bold', fontSize=10.2, leading=14, textColor=INK, spaceBefore=5, spaceAfter=2),
    'section': ParagraphStyle('section', fontName='Times-Roman', fontSize=14, leading=18, textColor=INK, spaceBefore=11, spaceAfter=6, keepWithNext=True),
    'meta': ParagraphStyle('meta', fontName='Helvetica', fontSize=9.3, leading=13, textColor=MUTED, spaceAfter=3),
    'date': ParagraphStyle('date', fontName='Helvetica', fontSize=9.3, leading=14, textColor=MUTED, alignment=2),
}
content = []


def e(text):
    return escape(str(text).replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', '-').replace('\u2212', '-'))


def para(text, style='body'):
    return Paragraph(text, styles[style])


def add(text, style='body'):
    content.append(para(text, style))


def research_topic(topic):
    return [para(e(topic['title']), 'topic'), *[
        para(e(paragraph)) for paragraph in topic['paragraphs']
    ]]


def dated_heading(title, date, style='title'):
    row = Table([[para(e(title), style), para(e(date), 'date')]], colWidths=[PAGE_WIDTH * .68, PAGE_WIDTH * .32], hAlign='LEFT')
    row.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    return row


add(e(profile['name']), 'name')
contacts = []
if profile.get('email'):
    contacts.append(f'<link href="mailto:{e(profile["email"])}">{e(profile["email"])}</link>')
contacts.append(f'<link href="{e(profile["siteUrl"])}">{e(profile["domain"])}</link>')
if profile.get('github'):
    contacts.append(f'<link href="{e(profile["github"])}">{e(profile["github"].removeprefix("https://"))}</link>')
add(' | '.join(contacts), 'meta')
content.extend([Spacer(1, 5), HRFlowable(width='100%', thickness=.7, color=LINE)])

add('Education', 'section')
for index, entry in enumerate(selection['education']):
    if index:
        content.append(Spacer(1, 6))
    if entry['source'] == 'education':
        record = profile['education']
        block = [
            dated_heading(record['institution'], record['dates']),
            para(e((record.get('degree') or record['level']) + ' studies in ' + record['background'])),
        ]
        if record.get('program'):
            block.append(para(e(record['program'])))
    elif entry['source'] == 'exchangeEducation':
        record = profile['exchangeEducation']
        role = 'Undergraduate Exchange Student (non-degree)' if record['role'] == 'Non-degree Exchange Student' and record['level'] == 'Undergraduate exchange' else record['role']
        block = [
            dated_heading(record['institution'], record['dates']),
            para(e(role)),
            para('<b>Semester GPA: ' + e(record['semesterGpa']) + '</b> | ' + e(record['credits']) + ' credits'),
        ]
        selected_courses = []
        for code in entry.get('courseCodes', []):
            course = next((course for course in record['courses'] if course['code'] == code), None)
            if course is None:
                raise ValueError(f'Unknown selected CV course: {code}')
            label = e(course['name'])
            if course['level'] == 'Graduate level':
                label += ' - graduate level'
            selected_courses.append(label + ' (' + e(course['grade']) + ')')
        if selected_courses:
            block.append(para('<b>Selected coursework:</b> ' + '; '.join(selected_courses) + '.'))
    else:
        raise ValueError('Unknown CV education source: ' + entry['source'])
    content.append(KeepTogether(block))

add('Research Experience', 'section')
previous_institution = None
for index, entry in enumerate(selection['researchExperience']):
    record = next((record for record in profile['experience'] if record['role'] == entry['profileRole']), None)
    if record is None:
        raise ValueError('Unknown selected CV experience: ' + entry['profileRole'])
    if index:
        content.append(Spacer(1, 7))
    heading = []
    if record['institution'] != previous_institution:
        heading.append(para(e(record['institution']), 'title'))
    heading.append(dated_heading(record['role'], record['dates']))
    if record.get('group'):
        heading.append(para(e(record['group'].replace(' · ', ' | ')), 'meta'))
    topics = entry.get('topics', [])
    if topics:
        first, *remaining = topics
        heading.extend(research_topic(first))
        content.append(KeepTogether(heading))
        for topic in remaining:
            content.append(KeepTogether(research_topic(topic)))
    else:
        content.append(KeepTogether(heading))
    previous_institution = record['institution']

add('Course Project', 'section')
for index, entry in enumerate(selection['courseProjects']):
    record = next((record for record in coursework if record['id'] == entry['id']), None)
    if record is None:
        raise ValueError('Unknown selected CV course project: ' + entry['id'])
    if index:
        content.append(Spacer(1, 6))
    content.append(KeepTogether([
        dated_heading(record['title'], record['term']),
        para(e(record['course'] + ', ' + record['institution'] + ' | Instructor: ' + record['instructor']), 'meta'),
        para(e(entry['paragraph'])),
    ]))

add('Skills', 'section')
for skill in selection['skills']:
    add('<b>' + e(skill['label']) + ':</b> ' + e(', '.join(skill['items'])))


def footer(canvas, doc):
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(44, 23, profile['name'] + ' | ' + profile['domain'])
    canvas.drawRightString(A4[0] - 44, 23, str(doc.page))


SimpleDocTemplate(
    str(OUTPUT), pagesize=A4, rightMargin=44, leftMargin=44,
    topMargin=35, bottomMargin=38,
    title=profile['name'] + ' - CV', author=profile['name'],
    subject='Education, selected research experience, course project, and skills',
).build(content, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
