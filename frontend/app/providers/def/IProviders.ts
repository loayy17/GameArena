import type { ReactNode } from "react";

interface IAuthProviderProps {
  children: ReactNode;
}

interface IConnectionProviderProps {
  children: ReactNode;
}

interface IDashboardDataProviderProps {
  children: ReactNode;
}

interface IGameProviderProps {
  children: ReactNode;
}

export type { IAuthProviderProps, IConnectionProviderProps, IDashboardDataProviderProps, IGameProviderProps };
