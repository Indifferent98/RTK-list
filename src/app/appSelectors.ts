import React from "react";

import { AppRootState } from "./store";

export const selectIsInitialized = (state: AppRootState) => state.app.isInitialized;
export const selectStatus = (state: AppRootState) => state.app.status;
export const selectError = (state: AppRootState) => state.app.error;
