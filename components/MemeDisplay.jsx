import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const memeTemplates = [
  {
    id: 'drake',
    src: '/memes/drake.jpg',
    alt: 'Drake Meme',
    textPositions: [
      { top: '10%', left: '75%', width: '55%', height: '20%' },
      { top: '70%', left: '75%', width: '55%', height: '20%' }
    ],
    showBothTexts: true
  },
  {
    id: 'expanding-brain',
    src: '/memes/expanding-brain.jpg',
    alt: 'Expanding Brain Meme',
    textPositions: [
      { top: '5%', left: '50%', width: '90%', height: '20%' },
      { top: '30%', left: '50%', width: '90%', height: '20%' },
      { top: '55%', left: '50%', width: '90%', height: '20%' },
      { top: '80%', left: '50%', width: '90%', height: '20%' }
    ],
    showBothTexts: true
  },
  {
    id: 'trade-offer',
    src: '/memes/trade-offer.jpg',
    alt: 'Trade Offer Meme',
    textPositions: [
      { top: '30%', left: '35%', width: '30%', height: '20%' },
      { top: '45%', left: '65%', width: '30%', height: '20%' }
    ],
    showBothTexts: true
  },
  {
    id: 'skibidi',
    src: '/memes/skibidi-toilet.jpg',
    alt: 'Skibidi Toilet Meme',
    textPositions: [
      { top: '80%', left: '50%', width: '90%', height: '20%' }
    ],
    showBothTexts: false
  },
  {
    id: 'megamind',
    src: '/memes/megamind-no.jpeg',
    alt: 'Megamind No Meme',
    textPositions: [
      { top: '80%', left: '50%', width: '80%', height: '20%' }
    ],
    showBothTexts: false
  },
  {
    id: 'chill-guy',
    src: '/memes/chill-guy.jpg',
    alt: 'Chill Guy Meme',
    textPositions: [
      { top: '80%', left: '50%', width: '80%', height: '20%' }
    ],
    showBothTexts: false
  },
  {
    id: 'rick-roll',
    src: '/memes/rick-roll.mp4',
    alt: 'Rick Roll Meme',
    textPositions: [
      { top: '60%', left: '50%', width: '80%', height: '20%' }
    ],
    showBothTexts: false
  }
];

const MemeDisplay = ({ text, originalText }) => {
  const [templateIndex, setTemplateIndex] = useState(0);

  const changeTemplate = () => {
    const newIndex = Math.floor(Math.random() * memeTemplates.length);
    setTemplateIndex(newIndex);
  };

  const template = memeTemplates[templateIndex];

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        onClick={changeTemplate}
        className="w-full mb-2"
      >
        Change Meme Template
      </Button>
      <Card className="relative w-full max-w-md mx-auto overflow-hidden">
        <div className="relative aspect-square">
          {template.src.endsWith('.mp4') ? (
            <video
              src={template.src}
              alt={template.alt}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <Image
              src={template.src}
              alt={template.alt}
              layout="fill"
              objectFit="contain"
            />
          )}
          {template.textPositions.map((pos, index) => (
            <div
              key={index}
              className="absolute flex items-center justify-center p-2 text-center"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                height: pos.height,
                transform: 'translate(-50%, 0)',
              }}
            >
              <p className="text-lg font-bold text-white stroke-text">
                {template.showBothTexts ? (index === 0 ? originalText : text) : text}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MemeDisplay;