'use client';

interface Props {
  src: string;
}

export default function VideoBackground({ src }: Props) {
  return (
    <video
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
