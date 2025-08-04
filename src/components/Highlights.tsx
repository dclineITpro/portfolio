import React, { useState, useEffect, ComponentType } from 'react';
import {
  Target, Users, DollarSign, GitMerge,
  Award, Shield, Zap, BrainCircuit,
  Lightbulb, Network, MessageSquare, Cpu
} from 'lucide-react';

// Define the type for a highlight item
interface HighlightItem {
  text: string;
  icon: ComponentType<{ className?: string }>;
}

// Define the type for the data structure
interface HighlightsData {
  [key: string]: HighlightItem[];
}

const highlightsData: HighlightsData = {
  box1: [
    { text: "Strategic IT Leadership", icon: Target },
    { text: "Project & Team Management", icon: Users },
    { text: "Financial & Vendor Stewardship", icon: DollarSign },
    { text: "Business & IT Alignment", icon: GitMerge },
  ],
  box2: [
    { text: "Operational Excellence", icon: Award },
    { text: "IT Infrastructure & Security", icon: Shield },
    { text: "Reliability & Efficiency Focus", icon: Zap },
    { text: "Deep Technical Understanding", icon: BrainCircuit },
  ],
  box3: [
    { text: "Technology Innovation", icon: Lightbulb },
    { text: "Business Systems Integration", icon: Network },
    { text: "Stakeholder Engagement", icon: MessageSquare },
    { text: "Driving Digital Transformation", icon: Cpu },
  ],
};

const animationTiming = 750; // in milliseconds
const pauseTiming = 1500; // pause before cycling

const Highlights = () => {
  const [boxes, setBoxes] = useState([
    { id: 'box1', item: highlightsData.box1[0], visible: false, textIndex: 0 },
    { id: 'box2', item: highlightsData.box2[0], visible: false, textIndex: 0 },
    { id: 'box3', item: highlightsData.box3[0], visible: false, textIndex: 0 },
  ]);

  useEffect(() => {
    const animationSequence = async () => {
      const order = [0, 2, 1]; // Corresponds to box 1, 3, 2 by index

      // Initial fade in
      for (const i of order) {
        await new Promise(resolve => setTimeout(resolve, animationTiming));
        setBoxes(prev => prev.map((box, index) => (index === i ? { ...box, visible: true } : box)));
      }

      await new Promise(resolve => setTimeout(resolve, pauseTiming));

      // Continuous fade out/in cycle
      while (true) {
        for (const i of order) {
          // Fade out
          setBoxes(prev => prev.map((box, index) => (index === i ? { ...box, visible: false } : box)));
          await new Promise(resolve => setTimeout(resolve, animationTiming));

          // Update text and fade back in
          setBoxes(prev =>
            prev.map((box, index) => {
              if (index === i) {
                const newTextIndex = (box.textIndex + 1) % highlightsData[box.id].length;
                return {
                  ...box,
                  visible: true,
                  item: highlightsData[box.id][newTextIndex],
                  textIndex: newTextIndex,
                };
              }
              return box;
            })
          );

          await new Promise(resolve => setTimeout(resolve, pauseTiming));
        }
      }
    };

    animationSequence();
  }, []);

  return (
    <>
      {boxes.map(box => {
        const Icon = box.item.icon;
        return (
          <div
            key={box.id}
            className="cyber-card h-32 w-64 p-6 flex items-center justify-center text-center"
          >
            <div
              className={`flex flex-col items-center justify-center gap-2 transition-opacity duration-700 ${box.visible ? 'opacity-100' : 'opacity-0'}`}
            >
              <Icon className="w-8 h-8 text-cyber-blue" />
              <p className="text-slate-300">{box.item.text}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Highlights;
