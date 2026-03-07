import { PropsWithChildren, ReactNode } from 'react';

interface PanelProps extends PropsWithChildren {
  title: string;
  extra?: ReactNode;
}

const Panel = ({ title, extra, children }: PanelProps) => (
  <section className="panel">
    <header className="panel-header">
      <h3>{title}</h3>
      {extra}
    </header>
    <div className="panel-body">{children}</div>
  </section>
);

export default Panel;
