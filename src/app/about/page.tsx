import AboutUsClient, { AboutTranslations } from './AboutClient';

export type Language = 'en' | 'gr' | 'ru';
type AboutData = Record<string, AboutTranslations>;

export default async function AboutUsServer({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const langParam = searchParams?.lang;
  const lang: Language = langParam === 'gr' || langParam === 'ru' ? langParam : 'en';

  const res = await fetch(
    'https://arturkarapetyan-1981.github.io/host_api/about.json',
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch About Us data');
  }

  const data = (await res.json()) as AboutData;

  const content =
    data[lang] ?? data['en'] ?? Object.values(data)[0] ?? {
      title: '',
      subtitle: '',
      paragraphs: [],
      founded: '',
      mission: '',
    };

  return <AboutUsClient content={content} />;
}

