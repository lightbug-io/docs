// Slightly tweaked version of https://chat.openai.com/share/2312e12b-9299-4274-a90a-eda395bc4650

import React, { useState, useEffect } from "react";

const ModeFlagsComponent = () => {
  const [bitfieldValue, setBitfieldValue] = useState(0);
  const bitfieldDescriptions = [
    "SendStopImmediately",
    "StopTimeoutIsInMinutes",
    "HarshPowerBudget",
    "Lock2G",
    "DisableGpsOptimisations",
    "EnableShockDetect",
    "UwbBroadcasting",
    "UwbScanning"
  ];

  const calculateBitfield = (value) => {
    const bits = [];
    for (let i = 0; i < bitfieldDescriptions.length; i++) {
      const bit = (value & (1 << i)) !== 0;
      bits.push(bit);
    }
    return bits;
  };

  const [bitfieldBits, setBitfieldBits] = useState(calculateBitfield(bitfieldValue));

  useEffect(() => {
    setBitfieldBits(calculateBitfield(bitfieldValue));
  }, [bitfieldValue]);

  const handleValueChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 255) {
      setBitfieldValue(255);
    } else {
      setBitfieldValue(value);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      padding: "10px",
    }}>
      <input
        type="number"
        value={bitfieldValue}
        onChange={handleValueChange}
        style={{
          padding: "5px",
          borderRadius: "5px",
          textAlign: "center"
        }}
        max={255}
        min={0}
      />
      {bitfieldBits.map((bit, index) => (
        <div key={index} style={{ margin: "1px" }}>
          {bit ? "✅" : "❌"} {1 << index}: {bitfieldDescriptions[index]}
        </div>
      ))}
    </div>
  );
};

export default ModeFlagsComponent;
