import { PropsWithChildren } from 'react';

export function TypographyH1({ children }: PropsWithChildren) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
}

export function TypographyH2({ children }: PropsWithChildren) {
  return (
    <h2 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-2 my-4 mx-6 p-2">
      {children}
    </h2>
  );
}

export function TypographyH3({ children }: PropsWithChildren) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function TypographyH4({ children }: PropsWithChildren) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}
