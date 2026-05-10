import React from "react";
import TextInputComponent from "@components/TextInputComponent";

interface StepOneProps {
  nameService: string;
  setNameService: (value: string) => void;
}

const RegistrationAutoServiceStepOne: React.FC<StepOneProps> = ({
  nameService,
  setNameService,
}) => {
  return (
    <TextInputComponent
      value={nameService}
      setValue={setNameService}
      placeholder="Название автосервиса"
      isSearch={false}
    />
  );
};

export default RegistrationAutoServiceStepOne;