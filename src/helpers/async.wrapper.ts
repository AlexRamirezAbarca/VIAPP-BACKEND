export const asyncWrapper = async <ReturnType>(action: () => Promise<ReturnType>): Promise<ReturnType | null> => {
    try {
      return await action();
    } catch (e) {
      console.log("asyncWrapper", e);
      return null;
    }
  };
  