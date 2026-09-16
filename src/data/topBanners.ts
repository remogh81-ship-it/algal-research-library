export type TopBanner = {
  href: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  badge: string;
  cta: string;
};

export const topBanners: TopBanner[] = [
  {
    href: 'https://egyjs.journals.ekb.eg/',
    titleAr: 'المجلة المصرية للطحالب — المنصة العلمية الرسمية بالتعاون مع بنك المعرفة المصري (EKB)',
    titleEn: 'Egyptian Journal of Phycology — Official Peer-Reviewed Journal on EKB',
    subtitleAr: 'تصفح أحدث الأعداد المنشورة، وأرسل أوراقك البحثية في مجالات علوم الطحالب والتكنولوجيا الحيوية',
    subtitleEn: 'Explore published issues, submitted research, and breakthroughs in phycology & algal biotechnology',
    badge: 'المجلة الرسمية / Official Journal',
    cta: 'تصفح المجلة / Visit Journal',
  },
];
