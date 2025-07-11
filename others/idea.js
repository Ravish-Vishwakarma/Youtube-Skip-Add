// ---------------------------------- The Idea ---------------------------------- //
// Click the Ad Button to show POP-UP
// CLick the Block Button
// Click the Continue Button
// Click the Overalay Area to close the pop-up

// ---------------------------------- Commands ---------------------------------- //
// Clicking The Ad Button
document.querySelector('.ytp-ad-button.ytp-ad-button-link.ytp-ad-clickable.ytp-ad-hover-text-button--clean-player').click();


// Clicking the Block Button
function waitForBlockButtonInIframe(iframe, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    function check() {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const btn = iframeDoc.querySelector('button[jsname="CDQEYe"]');
      if (btn) {
        resolve(btn);
      } else if (Date.now() - start > timeout) {
        reject('Block button did not appear in iframe in time');
      } else {
        requestAnimationFrame(check);
      }
    }

    check();
  });
}

const iframe = document.getElementById('iframe');
waitForBlockButtonInIframe(iframe)
  .then(btn => {
    btn.click();
    console.log('Block button clicked inside iframe after waiting');
  })
  .catch(console.error);


// Clicking the Continue Button
const iframe = document.querySelector('#iframe'); // Or your iframe selector

if (iframe && iframe.contentDocument) {
  const iframeDoc = iframe.contentDocument;

  // Now select inside iframeDoc, not document
  const blockButton = iframeDoc.querySelector('button[aria-label="Block"]');
  if (blockButton) {
    blockButton.click();
    console.log('Block button clicked inside iframe');
  } else {
    console.log('Block button not found inside iframe');
  }

  // Same for continue button inside iframe
  const continueButton = [...iframeDoc.querySelectorAll('div[role="button"]')].find(btn => {
    const span = btn.querySelector('span.RveJvd.snByac');
    return span && span.textContent.trim() === 'CONTINUE' && btn.offsetParent !== null;
  });
  if (continueButton) {
    continueButton.click();
    console.log('Continue button clicked inside iframe');
  } else {
    console.log('Continue button not found inside iframe');
  }
} else {
  console.log('Iframe or iframe content not accessible');
}



// Clicking The Overlay area
document.querySelector('tp-yt-iron-overlay-backdrop.opened').click();














// 












async function automateAdInteraction() {
  const MAX_RETRIES = 3;

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const waitForElement = (selector, context = document, timeout = 10000, interval = 200) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkElement = () => {
        const element = context.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms.`));
        } else {
          setTimeout(checkElement, interval);
        }
      };
      checkElement();
    });
  };

  const waitForButtonByText = (buttonText, context = document, timeout = 10000, interval = 200) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkButton = () => {
        const buttons = [...context.querySelectorAll('button, div[role="button"]')];
        const foundButton = buttons.find(btn => {
          const text = btn.textContent ? btn.textContent.trim() : '';
          const span = btn.querySelector('span.RveJvd.snByac');
          const spanText = span ? span.textContent.trim() : '';
          return (text === buttonText || spanText === buttonText) && btn.offsetParent !== null;
        });
        if (foundButton) {
          resolve(foundButton);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Button with text "${buttonText}" not found within ${timeout}ms.`));
        } else {
          setTimeout(checkButton, interval);
        }
      };
      checkButton();
    });
  };

  console.log('Starting ad interaction automation...');

  let step1Success = false;
  let attempts1 = 0;
  while (!step1Success && attempts1 < MAX_RETRIES) {
    attempts1++;
    try {
      console.log(`Clicking main ad button (Attempt ${attempts1}/${MAX_RETRIES})...`);
      const adButton = await waitForElement('.ytp-ad-button.ytp-ad-button-link.ytp-ad-clickable.ytp-ad-hover-text-button--clean-player', document, 5000);
      adButton.click();
      console.log('Main ad button clicked.');
      step1Success = true;
    } catch (error) {
      console.warn(`Could not click main ad button: ${error.message}`);
      if (attempts1 < MAX_RETRIES) {
        console.log('Retrying Step 1...');
      } else {
        console.error('Max retries reached for Step 1. Moving to next step.');
      }
    }
  }

  let step2Success = false;
  let attempts2 = 0;
  while (!step2Success && attempts2 < MAX_RETRIES) {
    attempts2++;
    try {
      console.log(`Looking for iframe and block button (Attempt ${attempts2}/${MAX_RETRIES})...`);
      const iframe = await waitForElement('#iframe', document, 5000);
      if (iframe && iframe.contentDocument) {
        console.log('Iframe found. Waiting for "Block" button inside iframe...');
        const iframeDoc = iframe.contentDocument;
        const blockButton = await waitForElement('button[jsname="CDQEYe"]', iframeDoc, 10000);
        blockButton.click();
        console.log('Block button clicked inside iframe.');
        step2Success = true;
      } else {
        throw new Error('Iframe or its content document not accessible for block button.');
      }
    } catch (error) {
      console.warn(`Could not click block button in iframe: ${error.message}`);
      if (attempts2 < MAX_RETRIES) {
        console.log('Retrying Step 2...');
      } else {
        console.error('Max retries reached for Step 2. Moving to next step.');
      }
    }
  }

  let step3Success = false;
  let attempts3 = 0;
  while (!step3Success && attempts3 < MAX_RETRIES) {
    attempts3++;
    try {
      console.log(`Looking for "CONTINUE" button inside iframe (Attempt ${attempts3}/${MAX_RETRIES})...`);
      const iframe = await waitForElement('#iframe', document, 5000);
      if (iframe && iframe.contentDocument) {
        console.log('Iframe found. Waiting for "CONTINUE" button inside iframe...');
        const iframeDoc = iframe.contentDocument;
        const continueButton = await waitForButtonByText('CONTINUE', iframeDoc, 10000);
        continueButton.click();
        console.log('Continue button clicked inside iframe.');
        step3Success = true;
      } else {
        throw new Error('Iframe or its content document not accessible for continue button.');
      }
    } catch (error) {
      console.warn(`Could not click continue button in iframe: ${error.message}`);
      if (attempts3 < MAX_RETRIES) {
        console.log('Retrying Step 3...');
      } else {
        console.error('Max retries reached for Step 3. Moving to next step.');
      }
    }
  }

  let step4Success = false;
  let attempts4 = 0;
  while (!step4Success && attempts4 < MAX_RETRIES) {
    attempts4++;
    try {
      console.log(`Clicking overlay backdrop (Attempt ${attempts4}/${MAX_RETRIES})...`);
      const overlayBackdrop = await waitForElement('tp-yt-iron-overlay-backdrop.opened', document, 5000);
      overlayBackdrop.click();
      console.log('Overlay backdrop clicked.');
      step4Success = true;
    } catch (error) {
      console.warn(`Could not click overlay backdrop: ${error.message}`);
      if (attempts4 < MAX_RETRIES) {
        console.log('Retrying Step 4...');
      } else {
        console.error('Max retries reached for Step 4. Automation might not have completed as expected.');
      }
    }
  }

  console.log('Ad interaction automation finished.');
}

// automateAdInteraction();
