import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./multiRangeSlider.css";
import { Input, Button } from "@material-tailwind/react";

const MultiRangeSlider = ({ min, max, setRange }) => {
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("");
  const range = useRef(null);
  const handleMinInputChange = (event) => {
    const value = event.target.value.trim();
    if (value === "") {
      setMinVal("");
      setRange({
        min: null,
        max: maxVal ? maxVal.toLocaleString("vi-VN") + " VND" : null,
      });
    } else {
      const maxValue = maxVal === "" ? max : maxVal;
      const numericValue = Math.min(
        Math.max(Math.floor(Number(value.replace(/\D/g, ""))), min),
        maxValue - 1000000
      );

      setMinVal(numericValue);

      setRange({
        min: numericValue
          ? numericValue.toLocaleString("vi-VN") + " VND"
          : null,
        max: maxValue ? maxValue.toLocaleString("vi-VN") + " VND" : null,
      });
    }
  };

  const handleMaxInputChange = (event) => {
    const value = event.target.value.trim();
    if (value === "") {
      setMaxVal("");
      setRange({
        min: minVal ? minVal.toLocaleString("vi-VN") + " VND" : null,
        max: null,
      });
    } else {
      const minValue = minVal === "" ? min : minVal;
      const numericValue = Math.max(
        Math.min(Math.ceil(Number(value.replace(/\D/g, ""))), max),
        minValue + 1000000
      );

      setMaxVal(numericValue);

      setRange({
        min: minValue ? minValue.toLocaleString("vi-VN") + " VND" : null,
        max: numericValue
          ? numericValue.toLocaleString("vi-VN") + " VND"
          : null,
      });
    }
  };

  const handleClear = () => {
    setMinVal(min);
    setMaxVal(max);
  };

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = minVal === "" ? 0 : getPercent(minVal);
    const maxPercent = maxVal === "" ? 100 : getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  return (
    <div className="multi-range-slider">
      <div className="multi-range-slider__labels"></div>

      <input
        type="range"
        min={min}
        max={max}
        value={minVal !== "" ? minVal : min}
        step={1000000}
        onChange={handleMinInputChange}
        className="multi-range-slider__thumb multi-range-slider__thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal !== "" ? maxVal : max}
        step={1000000}
        onChange={handleMaxInputChange}
        className="multi-range-slider__thumb multi-range-slider__thumb--right"
      />

      <div className="multi-range-slider__slider">
        <div className="multi-range-slider__track" />
        <div ref={range} className="multi-range-slider__range" />
      </div>

      <div className="multi-range-slider__values flex flex-row gap-2">
        <div className="multi-range-slider__input">
          <input
            placeholder="Min"
            type="text"
            value={minVal === "" ? "" : minVal.toLocaleString()}
            onChange={handleMinInputChange}
            className="multi-range-slider__value-input"
          />
          <span>VND</span>
        </div>
        <div className="multi-range-slider__input">
          <input
            placeholder="Max"
            type="text"
            value={maxVal === "" ? "" : maxVal.toLocaleString()}
            onChange={handleMaxInputChange}
            className="multi-range-slider__value-input"
          />
          <span>VND</span>
        </div>
      </div>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  setRange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;
