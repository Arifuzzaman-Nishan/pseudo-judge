import React, { FC } from "react";

interface Props {
  ref?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  bgLayer?: React.ReactNode;
  id?: string;
}

const Container: FC<Props> = ({ children, ref, bgLayer, id }) => {
  return (
    <section
      id={id}
      ref={ref}
      className="relative w-full overflow-hidden overflow-x-clip"
    >
      {bgLayer}
      <div className="bg-pattern pt-32">
        <div className="container mx-auto">{children}</div>
      </div>
    </section>
  );
};

export default Container;
