import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

const MultiRangeSlider = ({ min, max, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const range = useRef(null);

  const handleMinInputChange = (event) => {
    const value = Math.min(
      Math.max(Math.floor(Number(event.target.value.replace(/\D/g, ""))), min),
      maxVal - 1000000
    );
    setMinVal(value);
  };

  const handleMaxInputChange = (event) => {
    const value = Math.max(
      Math.min(Math.ceil(Number(event.target.value.replace(/\D/g, ""))), max),
      minVal + 1000000
    );
    setMaxVal(value);
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
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  return (
    <div className="container-custom">
      <div className="slider__labels"></div>

      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={1000000}
        onChange={(e) => handleMinInputChange(e)}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        step={1000000}
        onChange={(e) => handleMaxInputChange(e)}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
      </div>

      <div className="slider__values">
        <div className="slider__input">
          <input
            type="text"
            value={minVal.toLocaleString()}
            onChange={(e) => handleMinInputChange(e)}
            className="value-input"
          />
          <span>₫</span>
        </div>
        <div className="slider__input">
          <input
            type="text"
            value={maxVal.toLocaleString()}
            onChange={(e) => handleMaxInputChange(e)}
            className="value-input"
          />
          <span>₫</span>
        </div>
      </div>

      <div className="slider__actions">
        <button className="reset-button" onClick={handleClear}>
          Xóa lọc
        </button>
        <button className="apply-button">Áp dụng</button>
      </div>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;
