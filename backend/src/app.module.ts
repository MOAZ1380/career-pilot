import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ContactInfoModule } from './contact-info/contact-info.module';
import { SkillModule } from './skill/skill.module';
import { ExperienceModule } from './experience/experience.module';
import { ProjectModule } from './project/project.module';
import { EducationModule } from './education/education.module';
import { CertificateModule } from './certificate/certificate.module';
import { LanguageModule } from './language/language.module';
import { ResumeModule } from './resume/resume.module';
import { AiService } from './ai/ai.service';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    ProfileModule,
    ContactInfoModule,
    SkillModule,
    ExperienceModule,
    ProjectModule,
    EducationModule,
    CertificateModule,
    LanguageModule,
    ResumeModule,
    AiModule,
  ],
  controllers: [],
  providers: [AiService],
})
export class AppModule {}
