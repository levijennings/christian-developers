import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabItem = tabs.find((tab) => tab.id === activeTab);

  return (
    <div>
      <div
        className={`flex gap-0 border-b border-gray-200`}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            className={`
              px-4 py-3 font-medium text-sm font-[Instrument_Sans] transition-colors relative
              ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              flex items-center gap-2
            `}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTabItem && (
        <div
          id={`tab-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={activeTab}
          className="mt-4"
        >
          {activeTabItem.content}
        </div>
      )}
    </div>
  );
};

export default Tabs;
