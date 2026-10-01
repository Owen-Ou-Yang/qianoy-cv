# Content provenance and editorial boundaries

Updated from the owner's messages on 2026-09-27 through 2026-10-01. This file records what was supplied, what remains unknown, and why research output is separated from publications. It is not evidence of independent scientific validation.

| 用户确认的信息 | 网站 / CV 英文表述 |
| --- | --- |
| 姓名与邮箱 | Qian Ouyang; qouyang@nd.edu |
| 西安交通大学人工智能拔尖班；专业人工智能；本科、大四；2023 入学，2027 毕业 | Fourth-year undergraduate, Artificial Intelligence, Artificial Intelligence Experimental Class; 2023 - 2027 (expected) |
| 圣母大学 AME 的 Tengfei Luo 老师组 RA；2025 年 10 月至今 | Research Assistant, Prof. Tengfei Luo's group, Department of Aerospace and Mechanical Engineering, University of Notre Dame; October 2025 - Present |
| 2025 年 8–12 月在圣母大学做学期 visiting student | Visiting Student, August - December 2025 |
| 2026 年 7–9 月在圣母大学做 iSURE 暑研 | Summer Research Participant (iSURE), July - September 2026 |
| MLIP 的 HPC 优化非常重要，关注显存、冗余和速度 | Research interest in memory efficiency, computational redundancy, and simulation throughput |
| UMA/FAIR-Chem 项目遇到显存限制，是 HPC 优化兴趣的来源 | GPU-memory constraints encountered while developing UMA/FAIR-Chem workflows motivated an interest in efficient ML interatomic potentials |
| 有 CRC 使用经验；C++ 和 Python | Research computing experience with CRC; C++, Python |
| 2026-09-28：JEPA 可以先不放，前两个可以放 | Publish the MACE GPU engineering pilot and preliminary polymer density screening; exclude JEPA results and coursework |
| 2026-09-28：之前那个 UMA FAIRchem 的项目也可以加上去 | Add the earlier UMA/FAIR-Chem workflow as a third case study and explain its connection to HPC interests |
| 2026-09-30：UMA 受显存限制，未做出实质结果，不希望优先展示 | Highlight the two JEPA lines and the completed measurement studies; place UMA last in the full list and label it resource-limited exploration with no validated property results |
| 2026-09-30：决定把尝试的 CG JEPA 与 encoder 对比中新开的 MACE JEPA 加入 CV 网站 | Add two bounded research descriptions to the website and shared CV; distinguish completed CG exploration from ongoing atomistic MACE work |
| 2026-10-01：UMA 与 MACE 材料属性计算一脉相承；CG 与 MACE 是 JEPA 内的不同尝试，需要更清晰的项目逻辑 | Organize the same five records into molecular dynamics representation learning and MLIP material properties and efficiency; explain the development within each line |
| 2026-09-29：不喜欢页首 q.；与英国的联系只是口音有一部分英国味儿，考虑加一个小玩笑 | Name-only header; a brief About-page aside about the .uk domain and a partly British accent, without implying UK nationality, residence, or affiliation |

The GitHub profile `Owen-Ou-Yang` was identified through the connected GitHub account. LinkedIn remains unknown. Public research content includes the approved CG JEPA and MACE JEPA descriptions, UMA/FAIR-Chem workflow, and two measurement studies. The two JEPA entries contain bounded editorial summaries rather than copied research reports or newly released numerical figures. It does not include private research documents, unrelated results, configuration files, server details, or credentials.

## Reading and navigation

On 2026-10-01, the owner requested removing the systems/networking skill from the academic profile. The shared skill data and regenerated PDF omit that entry; the remaining simulation, HPC, and programming skills are preserved.

On 2026-09-30, the owner requested removing the GitHub profile link from Contact only. The Contact page keeps the academic email and optional LinkedIn field; GitHub links on the homepage, CV, and relevant project pages remain available.

On 2026-09-30, the owner reported that the visual design felt uncomfortable to read. The revision reduces heading sizes and repeated introductory content, uses plain page titles and compact research summaries, and keeps complete methods, observations, figures, and limitations on the existing detail pages. The optional project `preview` fields describe the same approved work without introducing new numerical conclusions. The homepage `overview` summarizes confirmed affiliations and interests. Academic records, shared CV summaries, and the PDF CV are unchanged.

On 2026-10-01, the owner requested clearer research logic across the projects. The revision groups the existing case studies under two lines: molecular dynamics representation learning, connecting CG exploration and encoder comparison to ongoing MACE JEPA; and MLIP material properties and efficiency, connecting earlier UMA exploration to MACE density screening and GPU resource evaluation. The homepage introduces the two lines before linking selected studies; Research and Projects show grouped case studies, and detail pages link back to their own line and related work within it. The HTML and PDF CV use the same groups. Line narratives and project context live in `src/data/research-lines.json` and its typed module, with a shared `ResearchLine.astro` component. Existing case-study URLs and scientific claim limits are preserved.

The progression narrative explains research motivation and methodology rather than a sequence of validated successes. MACE serves as an interatomic potential for material-property simulations in one line and as a source of pretrained molecular features in the other. Encoder comparison is a bridge within the existing JEPA line, not an invented separate output. UMA remains background to the properties-and-efficiency line and appears last within that group, without a homepage study highlight.

## Editorial scope

On 2026-09-28, after reviewing the proposed GPU-resource and density figures, the owner explicitly approved these two specific visuals and results for the website. In a subsequent message, the owner approved adding the earlier UMA/FAIR-Chem project and explained that its GPU-memory limits motivated their HPC optimization interests. These approvals supersede the earlier request to withhold all projects for these three case studies only. The later 2026-09-30 instruction adds CG JEPA and MACE JEPA descriptions and supersedes the earlier JEPA exclusion for these two entries. It does not authorize publication of complete research directories, unpublished project drafts, coursework, or unrelated measurements.

`src/data/projects.json` contains five published records: two representation-learning investigations, one workflow case study, and two measurement studies. The shared research-line data groups these records without creating new case studies. The homepage links MACE JEPA and CG JEPA within the representation-learning line and MACE density screening and GPU resource evaluation within the properties-and-efficiency line. Research and both CV formats include all five in the same two groups. Each supplies a bounded `cvSummary` to the HTML and PDF CV. The UMA page uses an HTML schematic to explain workflow stages. Static SVG figures, downloadable PNG versions, and small CSV files contain the two measurement studies' selected approved values; a separate name-and-research-identity image supplies the social preview. These assets require no client JavaScript. The publication array remains empty, and none of these records sets `output` or creates a publication citation.

### UMA/FAIR-Chem polymer workflow

The earlier source describes an elastic-response workflow: fixed-box baseline preparation, twelve signed finite-strain calculations, and stress-tensor/modulus post-processing, with single-snapshot and batch execution. This supports describing prepared workflow components. The owner clarified on 2026-09-30 that GPU-memory constraints prevented meaningful results, so the entry is labeled resource-limited exploration, placed last within the properties-and-efficiency group, and excluded from homepage study highlights. Later thermal-property paths concern Tg and density development; they do not establish validated UMA Tg or equilibrium-density results. The case-study route is `/projects/uma-fairchem-polymer-workflow/`.

The connection between practical GPU-memory limitations and the owner's HPC research interests is explicitly user-confirmed. It is a statement of research motivation, not a quantified performance result. The HTML workflow schematic describes the computational process and contains no measured UMA property values. No quantitative UMA accuracy, optimization gain, or completed thermal-property validation is claimed. The later MACE resource and density case studies retain their own evidence and limitations rather than being relabeled as UMA results.

### MACE GPU engineering pilot

The completed two- and four-GPU configurations measured the same short MACE workload. Observed wall time decreased from 117.3 to 62.7 minutes and maximum sampled per-device memory from 21.68 to 11.13 GiB; allocated GPU time increased from 3.91 to 4.18 GPU-hours. The three-GPU initialization failure remains part of the record. Each configuration was attempted once on different hosts. Memory values are sampled measurements, not exact allocator peaks. These short runs did not pass scientific density quality checks.

The case study shows resource evaluation and a measured trade-off. It does not establish general scaling, equilibrium density, or a novel model-optimization algorithm.

### Preliminary polymer density screening

The density case study is a snapshot of three MACE pilots for PE, PMP, and PIB, as of 17 September 2026. Each used one initial packing and 25 ps of sampling. Their simulation means differ from the available reference table by −2.59%, +3.25%, and −0.80%, respectively. The reference values are external data reported as experimental, not measurements made by Qian Ouyang.

Reference phase, temperature, molecular weight, and measurement uncertainty remain incompletely specified. Temporal intervals characterize within-run sampling, not variation across independent packings or experimental uncertainty. The work remains preliminary screening and is not production-qualified experimental validation; the three differences do not establish general predictive accuracy.

### CG JEPA and MACE JEPA

The CG JEPA entry summarizes the completed exploratory phase documented in `A_LINE_SUMMARY.md` and its supporting ablation and frozen public-CGPS reports. It covers local packing, relative-displacement interfaces, physical readouts, and temporal baselines. Useful geometry came from explicit geometric interfaces and current-state supervision; temporal JEPA variants did not surpass the strong linear physical baselines in the completed phase. Fixed-horizon observable prediction is not complete coarse-grained coordinate generation.

The MACE JEPA entry follows the encoder audit into executed atomistic-water pilots and subsequent diagnostics through 2026-09-30. The initial pilot favored direct physical supervision with frozen MACE, while later temporal-pairing controls showed task- and readout-dependent effects. A separate hydrogen-bond exchange propensity study used frozen MACE features and a fitted physical readout. Its improvement relative to the specified geometry baseline is not a JEPA training result; additional feature dimensions, shared simulation ancestry, and previously inspected evaluation labels limit the interpretation.

Source reports are read-only supporting evidence. No private source report, training artifact, CRC identifier, checkpoint, or raw trajectory is copied into the public repository. No project start date or public code link is inferred. These entries do not create publication citations. Their bounded `cvSummary` fields update the HTML and PDF CV together. PDF research sections and page division follow the shared line groups, keeping CG and MACE JEPA together and grouping the three properties-and-efficiency entries; its font size is preserved.

### Other claims

- The two JEPA entries describe concrete exploratory work and bounded observations. They do not claim a general JEPA advantage, a production trajectory generator, a paper, or broad material generalization.
- MLIP optimization remains a research direction. The approved engineering measurement does not claim a newly optimized algorithm or controlled general performance improvement. The owner-approved account of GPU-memory limitations explains the origin of this interest; it does not assert hardware capacity, infrastructure details, or a measured optimization gain.
- Undergraduate status, enrollment year, expected graduation year, RA start month/year, and programming languages are user-confirmed. No B.Eng./B.Sc. degree type, enrollment/graduation month, language proficiency rating, GPA, award, publication, or additional quantitative result has been inferred.
- The current RA, visiting student, and iSURE records are separate. The two visit dates are not treated as continuous employment dates.

## Official terminology checked

These primary sources establish names only, not the user's participation or affiliations, which were supplied by the user:

- [Xi'an Jiaotong University](https://en.xjtu.edu.cn/)
- [Official college overview using “Artificial Intelligence (AI) experimental class”](https://en.xjtu.edu.cn/2021-03/22/c_605250.htm); this descriptive label is used without inventing an Honors designation or degree type.
- [Department of Aerospace and Mechanical Engineering, University of Notre Dame](https://ame.nd.edu/)
- [Professor Tengfei Luo](https://engineering.nd.edu/faculty/tengfei-luo/)
- [Notre Dame summer research programs: International Summer Undergraduate Research Experience (iSURE)](https://research.nd.edu/our-services/funding-opportunities/undergraduates/summer-research-opportunities/)
- [Center for Research Computing (CRC)](https://crc.nd.edu/)

Do not relabel the visiting semester as a named exchange program or the summer program as E-SURE without confirmation.
