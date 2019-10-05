import React from 'react';

const Layout = ({
                  pageName, menu, children
                }) => {
  return (
    <main className={`${pageName} layout`}>
      <nav>
        { menu }
      </nav>

      <section>
        { children }
      </section>
    </main>
  );
};

export default Layout;
