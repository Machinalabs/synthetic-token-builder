import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export interface StepDefinition {
  route: string;
  order: number;
  name: string;
  key: string;
}

type Step = StepDefinition[];

export const DEFAULT_STEP = 0;

const STEPS: Step = [
  {
    key: "select_collateral_token",
    route: "select_collateral_token",
    order: 1,
    name: "Select collateral token",
  },
  {
    key: "select_price_identifier",
    order: 2,
    route: "select_price_identifier",
    name: "Select price identifier",
  },
  {
    key: "create_expiring_multiparty",
    order: 3,
    route: "create_expiring_multiparty",
    name: "Create expiring multiparty",
  },
  // {
  //   key: "mint",
  //   order: 4,
  //   route: "mint",
  //   name: "Mint",
  // },
];

interface IStepProvider {
  getAllSteps: () => Step;
  getNextStep: () => StepDefinition;
  currentStep: StepDefinition;
  getStepBefore: () => StepDefinition;
  isLastStep: () => boolean;
  goNextStep: () => void;
  goStepBefore: () => void;
  isCurrentStepCompleted: boolean;
  setCurrentStepCompleted: () => void;
  restart: () => void;
  getDefaultStep: () => StepDefinition;
}

/* tslint:disable */
const StepContext = React.createContext<IStepProvider>({
  getAllSteps: () => STEPS,
  getNextStep: () => STEPS[DEFAULT_STEP],
  currentStep: STEPS[DEFAULT_STEP],
  getStepBefore: () => STEPS[DEFAULT_STEP],
  isLastStep: () => false,
  goNextStep: () => {},
  goStepBefore: () => {},
  isCurrentStepCompleted: false,
  setCurrentStepCompleted: () => {},
  restart: () => {},
  getDefaultStep: () => STEPS[DEFAULT_STEP],
});
/* tslint:enable */

export const StepProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(STEPS[DEFAULT_STEP]);
  const [isCurrentStepCompleted, setIsCurrentStepCompleted] = useState(false);

  const getNextStep = () => {
    const result = getNextStepInternal();
    if (!result) {
      throw new Error(
        "Invalid state, it shouldn't be called if there is not a next step"
      );
    }
    return result;
  };

  const getAllSteps = () => STEPS;

  const isLastStep = () => {
    const result = getNextStepInternal();
    if (!result) {
      return true;
    }
    return false;
  };

  const getStepBefore = () => {
    const allSteps = getAllSteps();
    const currentOrder = currentStep.order;
    const stepBeforeOrder = currentOrder - 1;

    const result = allSteps.find((s) => s.order === stepBeforeOrder);

    if (!result) {
      throw new Error(
        "Invalid state, it shouldn't be called if there is not a step before"
      );
    }
    return result;
  };

  const goNextStep = () => {
    const nextStep = getNextStepInternal();
    if (!nextStep) {
      throw new Error("There is not next step");
    }
    setCurrentStep(nextStep);
  };

  const goStepBefore = () => {
    const stepBefore = getStepBefore();
    if (!stepBefore) {
      throw new Error("There is not step before");
    }
    setCurrentStep(stepBefore);
  };

  const getNextStepInternal = () => {
    const allSteps = getAllSteps();
    const currentOrder = currentStep.order;
    const nextStepOrder = currentOrder + 1;

    return allSteps.find((s) => s.order === nextStepOrder);
  };

  const setCurrentStepCompleted = () => {
    setIsCurrentStepCompleted(true);
  };

  const restart = () => {
    setCurrentStep(STEPS[DEFAULT_STEP]);
  };

  const getDefaultStep = () => {
    return STEPS[DEFAULT_STEP];
  };

  useEffect(() => {
    setIsCurrentStepCompleted(false);
  }, [currentStep]);

  return (
    <StepContext.Provider
      value={{
        getAllSteps,
        currentStep,
        getNextStep,
        getStepBefore,
        isLastStep,
        goNextStep,
        goStepBefore,
        setCurrentStepCompleted,
        isCurrentStepCompleted,
        restart,
        getDefaultStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

export const useStep = () => {
  const context = useContext(StepContext);

  if (context === null) {
    throw new Error(
      "useStep() can only be used inside of <StepProvider />, please declare it at a higher level"
    );
  }
  return context;
};
