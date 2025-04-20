export const animations = {
  success: `
    @keyframes success-animation {
      0% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0; transform: scale(1); }
    }
    .success-animation {
      animation: success-animation 1.5s ease-in-out;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 50;
    }
  `,
  error: `
    @keyframes error-animation {
      0% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0; transform: scale(1); }
    }
    .error-animation {
      animation: error-animation 1.5s ease-in-out;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 50;
    }
  `,
  tooltip: `
    [data-tooltip] {
      position: relative;
    }
    [data-tooltip]:after {
      opacity: 0;
      visibility: hidden;
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% + 10px);
      left: 0;
      background: #1f2937;
      padding: 8px 12px;
      border-radius: 4px;
      white-space: pre-wrap;
      max-width: 500px;
      min-width: 200px;
      width: auto;
      z-index: 10;
      font-size: 13px;
      line-height: 1.4;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow-y: auto;
      max-height: 300px;
      transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, transform 0.2s ease-in-out;
      transform: translateY(10px);
      pointer-events: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    [data-tooltip]:before {
      opacity: 0;
      visibility: hidden;
      content: '';
      position: absolute;
      bottom: 100%;
      left: 20px;
      border: 8px solid transparent;
      border-top-color: #1f2937;
      transform: translateY(3px);
      transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, transform 0.2s ease-in-out;
      pointer-events: none;
    }
    [data-tooltip]:hover:after,
    [data-tooltip]:hover:before {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  `
};