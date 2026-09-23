const fs = require('fs');
const path = require('path');

function injectTutorial(filePath, props) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already injected
    if (content.includes('PageTutorialModal')) return;

    // Insert import
    content = content.replace("import React", "import React\nimport { PageTutorialModal } from '../../components/ui/PageTutorialModal';");
    if (!content.includes('PageTutorialModal')) {
         // Fallback if import React isn't exactly matched
         content = "import { PageTutorialModal } from '../../components/ui/PageTutorialModal';\n" + content;
    }

    // Insert Modal at the beginning of the return statement
    const modalStr = `
      <PageTutorialModal 
        pageId="${props.pageId}"
        title="${props.title}"
        what="${props.what}"
        why="${props.why}"
        how="${props.how}"
        psAsk="${props.psAsk}"
        karmaTuteBuild="${props.karmaTuteBuild}"
        differentiator="${props.differentiator}"
      />
    `;

    // Find the first main return statement of the component
    // We assume it's `return (`
    content = content.replace(/return \(\s*<div/m, `return (\n    <>\n${modalStr}\n    <div`);
    // Then we need to close the fragment at the end. We assume the file ends with `</div>\n  );\n}`
    content = content.replace(/<\/div>\s*\);\s*\}\s*$/m, "</div>\n    </>\n  );\n}");

    fs.writeFileSync(filePath, content);
}

const pages = [
    {
        file: 'c:/Users/VARDHAN/Downloads/SIH PROJECT/KarmaVaani/src/features/command-center/CommandCenterPage.tsx',
        pageId: 'command-center',
        title: 'Command Center',
        what: 'Your personalized starting point.',
        why: 'See what matters most right now.',
        how: 'Review the Next Best Action and act.',
        psAsk: 'recommendation system that maps learning to competencies.',
        karmaTuteBuild: 'Composed dashboard showing top priority gap and Next Best Action.',
        differentiator: 'Connects real-time competency gaps directly to actionable learning without dashboard wallpaper.'
    },
    {
        file: 'c:/Users/VARDHAN/Downloads/SIH PROJECT/KarmaVaani/src/features/competency-radar/SkillIntelligencePage.tsx',
        pageId: 'skill-intelligence',
        title: 'Skill Intelligence',
        what: 'Your competency map.',
        why: 'Understand what is required and where the gap exists.',
        how: 'Compare current vs target and inspect \"Why this?\".',
        psAsk: 'AI based application/ software for automated skill-gap analysis.',
        karmaTuteBuild: 'Deterministic competency engine with historical snapshot retention.',
        differentiator: 'AI assists in extraction, but deterministic math ensures government-grade auditable gaps.'
    },
    {
        file: 'c:/Users/VARDHAN/Downloads/SIH PROJECT/KarmaVaani/src/features/karma-vaani/ExecutionLabPage.tsx',
        pageId: 'execution-lab',
        title: 'Execution Lab',
        what: 'Your capability verification workspace.',
        why: 'We test execution, not only knowledge.',
        how: 'Complete Level 1, Level 2 and Level 3 tasks.',
        psAsk: 'continuous assessment... MCQ generation from uploaded materials.',
        karmaTuteBuild: 'Multi-level assessment (MCQ, OCR Written, Scenarios).',
        differentiator: 'Moves beyond simple MCQs to OCR-assisted written execution and scenario confidence scoring.'
    },
    {
        file: 'c:/Users/VARDHAN/Downloads/SIH PROJECT/KarmaVaani/src/features/growth-proof/GrowthProofPage.tsx',
        pageId: 'growth-proof',
        title: 'Growth & Proof',
        what: 'Your evidence-backed capability record.',
        why: 'See whether learning changed actual competency.',
        how: 'Review evidence, trajectory and proof.',
        psAsk: 'continuous assessment and learning footprint.',
        karmaTuteBuild: 'Immutable evidence ledger and certificate issuance.',
        differentiator: 'Authoritative evidence model ensures no competency score exists without strict provenance.'
    },
    {
        file: 'c:/Users/VARDHAN/Downloads/SIH PROJECT/KarmaVaani/src/features/admin/AdminPage.tsx',
        pageId: 'admin',
        title: 'Workforce Admin',
        what: 'Workforce competency intelligence.',
        why: 'Identify priority capability gaps and training demand.',
        how: 'Inspect workforce patterns and evidence-backed insights.',
        psAsk: 'administrator dashboard.',
        karmaTuteBuild: 'Real-time aggregation of workforce competency gaps and system health.',
        differentiator: 'Focuses entirely on actionable intelligence (top gaps, urgency) rather than vanity metrics.'
    }
];

pages.forEach(p => {
    try {
        injectTutorial(p.file, p);
        console.log("Injected: " + p.file);
    } catch(e) {
        console.error("Failed on " + p.file, e);
    }
});
