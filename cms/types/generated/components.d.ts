import type { Schema, Struct } from '@strapi/strapi';

export interface SharedEducationPlatform extends Struct.ComponentSchema {
  collectionName: 'components_shared_education_platforms';
  info: {
    description: 'Individual education platform';
    displayName: 'EducationPlatform';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedEducationSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_education_sections';
  info: {
    description: 'Education section content';
    displayName: 'EducationSection';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    platforms: Schema.Attribute.Component<'shared.education-platform', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedExpertise extends Struct.ComponentSchema {
  collectionName: 'components_shared_expertises';
  info: {
    description: 'Individual expertise entry';
    displayName: 'Expertise';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.Enumeration<
      ['Code', 'Server', 'Palette', 'Layers', 'Cog']
    > &
      Schema.Attribute.Required;
    skillIdentifier: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLanguage extends Struct.ComponentSchema {
  collectionName: 'components_shared_languages';
  info: {
    description: 'Individual language entry';
    displayName: 'Language';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    level: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLanguagesSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_languages_sections';
  info: {
    description: 'Languages section content';
    displayName: 'LanguagesSection';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    languages: Schema.Attribute.Component<'shared.language', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMethodology extends Struct.ComponentSchema {
  collectionName: 'components_shared_methodologies';
  info: {
    description: 'Individual methodology entry';
    displayName: 'Methodology';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.Enumeration<
      [
        'GitBranch',
        'Building',
        'Cog',
        'GitPullRequest',
        'Users',
        'TestTube',
        'Smartphone',
        'Server',
      ]
    > &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPersonalInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_personal_infos';
  info: {
    description: 'Personal information fields';
    displayName: 'PersonalInfo';
  };
  attributes: {
    age: Schema.Attribute.Date & Schema.Attribute.Required;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    company: Schema.Attribute.String & Schema.Attribute.Required;
    contractType: Schema.Attribute.String & Schema.Attribute.Required;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    location: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
    workMode: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedProfileDescription extends Struct.ComponentSchema {
  collectionName: 'components_shared_profile_descriptions';
  info: {
    description: 'Profile information displayed in header';
    displayName: 'ProfileDescription';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    titles: Schema.Attribute.Component<'shared.profile-title', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
          min: 1;
        },
        number
      >;
  };
}

export interface SharedProfileTitle extends Struct.ComponentSchema {
  collectionName: 'components_shared_profile_titles';
  info: {
    description: 'Animated titles in profile description';
    displayName: 'ProfileTitle';
  };
  attributes: {
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media link with icon';
    displayName: 'SocialLink';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    iconType: Schema.Attribute.Enumeration<
      ['Github', 'Linkedin', 'Youtube', 'Twitter']
    > &
      Schema.Attribute.Required;
    target: Schema.Attribute.Enumeration<['_blank', '_self']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'_blank'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSoftSkill extends Struct.ComponentSchema {
  collectionName: 'components_shared_soft_skills';
  info: {
    description: 'Individual soft skill entry';
    displayName: 'SoftSkill';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.Enumeration<
      [
        'MessageSquare',
        'Users',
        'Lightbulb',
        'RefreshCw',
        'BookOpen',
        'Timer',
        'Crosshair',
        'Sparkles',
      ]
    > &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.education-platform': SharedEducationPlatform;
      'shared.education-section': SharedEducationSection;
      'shared.expertise': SharedExpertise;
      'shared.language': SharedLanguage;
      'shared.languages-section': SharedLanguagesSection;
      'shared.methodology': SharedMethodology;
      'shared.personal-info': SharedPersonalInfo;
      'shared.profile-description': SharedProfileDescription;
      'shared.profile-title': SharedProfileTitle;
      'shared.social-link': SharedSocialLink;
      'shared.soft-skill': SharedSoftSkill;
    }
  }
}
