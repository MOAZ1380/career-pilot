/**
 * resume-mapper.ts
 *
 * بيحول شكل الـ response الراجع من getOneResume (Prisma relations)
 * إلى شكل cvData اللي محتاجه PdfGenerator.
 */

interface CvLink {
  type: string;
  url: string;
}

/** يحول ISO date string لصيغة "Jan 2024" */
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** يحول EMPLOYMENT_TYPE من DB (FULL_TIME) لصيغة قابلة للعرض (Full Time) */
function formatEmploymentType(type?: string | null): string {
  if (!type) return '';
  return type
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * @param resume  الـ response الراجع من getOneResume
 * @param profile بيانات الـ Profile (الاسم، الايميل، التليفون...) - مش موجودة جوه الـ resume نفسه
 */
export function mapResumeToCvData(resume: any, profile?: any) {
  return {
    // ===== Header (من الـ Profile مش من الـ resume) =====
    fullName: `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim(),
    title: profile?.headline || resume.title,
    email: profile?.contactInfo?.email || '',
    phone: profile?.contactInfo?.phone || '',
    location: profile?.contactInfo?.city || '',
    links: (profile?.contactInfo?.links || []).map((url: string) => ({
      type: url.includes('github')
        ? 'GitHub'
        : url.includes('linkedin')
          ? 'LinkedIn'
          : url.includes('portfolio')
            ? 'Portfolio'
            : 'Website',
    })),

    // ===== Summary =====
    summary: resume.generatedSummary || '',

    // ===== Skills =====
    // resume.skills[i].skill.name -> array of strings
    skills: (resume.skills || [])
      .map((s: any) => s.skill?.name)
      .filter(Boolean),

    // ===== Experience =====
    experiences: (resume.experiences || []).map((e: any) => {
      const exp = e.experience || {};
      const bullets: string[] =
        e.customDescription?.length > 0
          ? e.customDescription
          : exp.description || [];

      return {
        jobTitle: exp.position || '',
        companyName: exp.company || '',
        location: exp.location || '',
        startDate: formatDate(exp.startDate),
        endDate: exp.currentlyWorking ? 'Present' : formatDate(exp.endDate),
        currentlyWorking: !!exp.currentlyWorking,
        employmentType: formatEmploymentType(exp.employmentType),
        links: [] as CvLink[], // مفيش links في الـ experience data
        description: bullets.map((p) => `• ${p}`).join('\n'),
      };
    }),

    // ===== Projects =====
    projects: (resume.projects || []).map((p: any) => {
      const proj = p.project || {};
      const links: CvLink[] = [];
      if (proj.github) links.push({ type: 'GitHub', url: proj.github });
      if (proj.liveDemo) links.push({ type: 'Live Demo', url: proj.liveDemo });

      return {
        title: proj.name || '',
        description: p.customizedDescription || proj.description || '',
        startDate: formatDate(proj.startDate),
        endDate: proj.endDate ? formatDate(proj.endDate) : 'Present',
        currentlyOngoing: !proj.endDate,
        links,
        technologies: proj.technologies || [],
      };
    }),

    // ===== Education (مش موجودة في الداتا اللي بعتهالي - جاهزة لو اتضافت) =====
    education: (resume.educations || []).map((ed: any) => {
      const edu = ed.education;

      return {
        degree: edu.degree || '',
        fieldOfStudy: edu.field || '',
        schoolName: edu.university || '',
        location: '',
        grade: edu.grade || '',
        startDate: formatDate(edu.startDate),
        endDate: formatDate(edu.endDate),
        currentlyStudying: !edu.endDate,
        description: edu.description || '',
      };
    }),

    // ===== Languages =====
    languages: (resume.languages || []).map((l: any) => ({
      language: l.language.language,
      level: l.language.level,
    })),

    // ===== Certificates =====
    certificates: (resume.certificates || []).map((c: any) => {
      const cert = c.certificate || {};
      return {
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: formatDate(cert.issueDate),
        url: cert.credentialUrl || '',
        summary: cert.credentialId ? `Credential ID: ${cert.credentialId}` : '',
      };
    }),
  };
}
