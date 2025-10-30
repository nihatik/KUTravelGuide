import { Children, useEffect, useState, cloneElement, type ReactElement } from "react";
import "./TabsBox.css";
import Tab, { type TabProps } from "./Tab";

interface TabsBoxProps {
  children: ReactElement<typeof Tab>[] | ReactElement<typeof Tab>;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export default function TabsBox({ children, defaultTab, onChange }: TabsBoxProps) {
  const childArray = Children.toArray(children) as ReactElement<TabProps>[];
  const [activeTab, setActiveTab] = useState(defaultTab || childArray[0]?.props.id);
  const [contentActive, setContentActive] = useState(false);

  const handleSelect = (tabId: string) => {
    // Если нажали на уже активный таб — на мобилке сворачиваем/разворачиваем оверлей
    if (tabId === activeTab) {
      try {
        const hidden = document.body.classList.toggle('mobile-overlay-hidden');
        setContentActive(!hidden);
      } catch {
        // noop
      }
      return;
    }

    setActiveTab(tabId);
    onChange?.(tabId);

    setContentActive(false);
    setTimeout(() => {
      setContentActive(true);
    }, 300);
  };


  useEffect(() => {
    if (!childArray.some((child) => child.props.id === activeTab)) {
      setActiveTab(childArray[0]?.props.id);
    }
  }, [children, activeTab]);

  return (
    <div className="tabs-box">
      <div className="tabs-header">
        {childArray.map((child) =>
          cloneElement(child, {
            key: child.props.id,
            isActive: child.props.id === activeTab,
            onSelect: () => {
              child.props.onSelect?.();
              handleSelect(child.props.id);
            },
          })
        )}
      </div>

      <div className={`tabs-content ${contentActive ? "active" : ""}`}>
        <div key={activeTab} className="tab-pane fade-in">
          {childArray.find((child) => child.props.id === activeTab)?.props.children}
        </div>
      </div>
    </div>
  );
}
