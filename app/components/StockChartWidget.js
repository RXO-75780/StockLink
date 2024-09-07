import React, { useEffect } from "react";

const StockChartWidget = ({ sy }) => {
  useEffect(() => {
    const widgetContainer = document.getElementById(
      "tradingview-widget-container__widget"
    );
    const existingScript = document.getElementById("tradingview-widget-script");

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = "tradingview-widget-script";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.onload = () => {
      console.log("TradingView script loaded");
    };
    script.onerror = () => {
      console.error("Error loading TradingView widget script.");
    };
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: sy,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "5",
      locale: "en",
      allow_symbol_change: true,
      details: true,
      calendar: false,
      studies: ["STD;24h%Volume"],
      support_host: "https://www.tradingview.com",
    });

    if (widgetContainer) {
      widgetContainer.appendChild(script);
    } else {
      console.error("Widget container not found");
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [sy]);

  return (
    <div
      className="tradingview-widget-container"
      style={{ height: "100%", width: "100%", position: "relative" }}
    >
      <div
        id="tradingview-widget-container__widget"
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default StockChartWidget;
