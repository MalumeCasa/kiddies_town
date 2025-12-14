import React, { useState } from "react";

export const TooltipProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
    <>{children}</>
);

export const Tooltip: React.FC<{ content?: React.ReactNode } & React.PropsWithChildren<{}>> = ({
    children,
    content,
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <span
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {content && visible ? (
                <span
                    className="tooltip"
                    style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#333",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        whiteSpace: "nowrap",
                        zIndex: 100,
                    }}
                >
                    {content}
                </span>
            ) : null}
        </span>
    );
};

export const TooltipTrigger: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
    <span>{children}</span>
);

export const TooltipContent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
    <span className="tooltip-content">{children}</span>
);