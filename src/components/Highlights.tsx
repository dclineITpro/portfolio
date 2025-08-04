import React, { useState, useEffect } from 'react';

const highlightsData = {
  box1: [
    "Strategic IT Leadership",
    "Project & Team Management",
    "Financial & Vendor Stewardship",
    "Business & IT Alignment",
  ],
  box2: [
    "Operational Excellence",
    "IT Infrastructure & Security",
    "Reliability & Efficiency Focus",
    "Deep Technical Understanding",
  ],
  box3: [
    "Technology Innovation",
    "Business Systems Integration",
    "Stakeholder Engagement",
    "Driving Digital Transformation",
  ],
};

const animationTiming = 750; // in milliseconds
const pauseTiming = 1500; // pause before cycling

const Highlights = () => {
  const [boxes, setBoxes] = useState([
    { id: 'box1', text: highlightsData.box1[0], visible: false, textIndex: 0 },
    { id: 'box2', text: highlightsData.box2[0], visible: false, textIndex: 0 },
    { id: 'box3', text: highlightsData.box3[0], visible: false, textIndex: 0 },
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
                  text: highlightsData[box.id][newTextIndex],
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
      {boxes.map(box => (
        <div
          key={box.id}
          className="cyber-card h-32 w-64 p-6 flex items-center justify-center text-center"
        >
          <div
            className={`transition-opacity duration-700 ${box.visible ? 'opacity-100' : 'opacity-0'}`}
          >
            <p className="text-slate-300">{box.text}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Highlights;
