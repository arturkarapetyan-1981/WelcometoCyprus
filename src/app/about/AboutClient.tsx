'use client';

import { motion } from 'framer-motion';

export type AboutTranslations = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  founded: string;
  mission: string;
};

type Props = {
  content: AboutTranslations;
};

export default function AboutUsClient({ content }: Props) {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden text-white">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/cyprus.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl px-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
        <h2 className="text-2xl font-semibold mb-6">{content.subtitle}</h2>
        {content.paragraphs.map((p, i) => (
          <p key={i} className="mb-4 text-lg leading-relaxed">
            {p}
          </p>
        ))}
        <p className="mt-6 italic">{content.founded}</p>
        <p className="italic">{content.mission}</p>
      </motion.div>
    </section>
  );
}




