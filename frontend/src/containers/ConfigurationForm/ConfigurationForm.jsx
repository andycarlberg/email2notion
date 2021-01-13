import { useEffect, useState } from "react";

import FormElement from "../../components/FormElement/FormElement";
import Button from "../../components/Button/Button";

const ConfigurationForm = ({ config, onApply }) => {
  const [checkFreq, setCheckFreq] = useState("");

  useEffect(() => {
    if (!config) {
      setCheckFreq("5m");
      return;
    }

    setCheckFreq(config.check_freq ?? "5m");
  }, [config]);

  const checkFreqChangeHandler = (event) => {
    setCheckFreq(event.target.value);
  };

  const applyHandler = () => {
    onApply({
      ...config,
      check_freq: checkFreq,
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <FormElement
        type="select"
        label="Frequency"
        name="check-freq"
        id="check-freq"
        value={checkFreq}
        onChange={checkFreqChangeHandler}
      >
        <option value="1m">1 minute</option>
        <option value="5m">5 minute</option>
        <option value="15m">15 minute</option>
        <option value="30m">30 minute</option>
        <option value="60m">60 minute</option>
      </FormElement>
      <div className="flex flex-row-reverse space-x-reverse space-x-4">
        <Button onClick={applyHandler}>Apply</Button>
        <Button variant="text">Check Now</Button>
      </div>
    </div>
  );
};

export default ConfigurationForm;
