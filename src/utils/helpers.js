export const generateUId = function () {
  return Date.now().toString(36) + Math.random().toString(36);
};
export const generateMapperId = function (prefix = 'dict', length = 3) {
  const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
  const paddedNumber = String(randomNumber).padStart(length, '0');
  return `${prefix}_${paddedNumber}`;
};
export const optionUniqeUId = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// export const toSnakeCase = (input) => {
//   return input.toLowerCase().replace(/\s/g, '_');
// };

export const toSnakeCase = (input) => {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '_');
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const operationUniqId = (operation) => {
  if (!operation || operation.length < 2) {
    return '';
  }

  const prefix = operation.substring(0, 3).toUpperCase();
  const digits = '0123456789';
  let randomNumber = '';

  for (let i = 0; i < 3; i++) {
    randomNumber += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  const id = `${prefix}-${randomNumber}`;
  return id;
};

export const getTimezoneOffset = () => {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const offsetHours = Math.abs(offsetMinutes) / 60;
  // Format the offset as +HH:mm or -HH:mm
  const offsetString =
    (offsetMinutes < 0 ? '+' : '-') +
    ('00' + Math.floor(offsetHours)).slice(-2) +
    ':' +
    ('00' + (offsetMinutes % 60)).slice(-2);
  return offsetString;
};

export const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Recursive function of fields.....
const getChildData = (data, fieldData) => {
  let children = [];
  for (const item of fieldData) {
    if (item.parentQueName === data.name) {
      let child = getChildData(item, fieldData);

      if (item.options && item.options.length > 0) {
        for (let elem of item?.options) {
          let cond = item?.condition?.filter((o) => o.value === elem?.optionId);
          elem['child'] = [];
          if (cond && cond.length > 0) {
            let foundedChild = child.filter((o) =>
              cond[0].fieldName.includes(o.name)
            );
            elem['child'] = foundedChild;
          }
        }
      }
      let newItem = { ...item, child: child };
      children.push(newItem);
    }
  }
  return children;
};

function getUniqueArray(arr, key) {
  return arr.filter(
    (item, index, self) =>
      self.findIndex((obj) => obj[key] === item[key]) === index
  );
}
export const operators = {
  String: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'like', value: 'LIKE' },
    { label: 'not like', value: 'NOT LIKE' },
    { label: 'in', value: 'IN' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ],
  Number: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'greater than', value: '>' },
    { label: 'less than', value: '<' },
    { label: 'greater than or equal to', value: '>=' },
    { label: 'less than or equal to', value: '<=' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ],
  Date: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'greater than', value: '>' },
    { label: 'less than', value: '<' },
    { label: 'greater than or equal to', value: '>=' },
    { label: 'less than or equal to', value: '<=' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ]
};
export const generateChild = (fieldDataa) => {
  let fieldData = [];
  for (const item of fieldDataa) {
    if (item.inDependent === false || !item.parentQueName) {
      let child = [];
      // if (item.child) {
      //   child = item.child;
      // }
      let foundedChild = getChildData(item, fieldDataa);
      child = [...foundedChild];
      // item.child = [...child];
      if (item.options && item.options.length > 0) {
        for (const elem of item.options) {
          if (elem) {
            let cond = Array.isArray(item.condition)
              ? item?.condition.filter((o) => o.value === elem.optionId)
              : [];
            elem['child'] = [];
            if (cond.length > 0) {
              let foundedChild = child.filter((o) =>
                cond[0].fieldName.includes(o.name)
              );
              const uniqueArray = getUniqueArray(foundedChild, 'name');
              elem['child'] = uniqueArray;
            }
          }
        }
      }
      let newItem = { ...item, child: child };
      fieldData.push(newItem);
    }
  }
  // setFieldList(fieldData);
  return fieldData;
};

export const checkPaletteLoaded = () => {
  const palette = document.querySelector('.djs-palette-entries');

  if (palette) {
    if (document.getElementById('hideCustomElem')) return;
    if (document.getElementById('stringToggleButton')) return;
    if (document.getElementById('dateTogglebtn')) return;

    // Function to create and insert buttons into the palette
    const createButton = (id, text, width, clickHandler) => {
      const button = document.createElement('button');
      button.id = id;
      button.textContent = text;
      button.style.fontSize = '12px';
      button.style.width = width;
      button.style.height = '30px';
      button.style.fontWeight = 500;
      button.style.backgroundColor =
        'hsl(var(--secondary-foreground)) !important';
      button.style.color = 'hsl(var(--secondary)) !important';
      button.style.padding = '5px 5px';
      button.style.borderRadius = '5px';
      button.style.border = 'solid 1px hsl(var(--secondary)) !important';

      button.addEventListener('mouseover', () => {
        button.style.backgroundColor = 'hsl(var(--secondary)) !important';
        button.style.color = 'white';
        button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      });

      button.addEventListener('mouseout', () => {
        button.style.backgroundColor =
          'hsl(var(--secondary-foreground)) !important';
        button.style.color = 'hsl(var(--secondary)) !important';
        button.style.boxShadow = '';
      });
      button.addEventListener('click', clickHandler);
      return button;
    };

    // Toggle the visibility of a group
    const toggleGroupVisibility = (
      groupSelector,
      button,
      showText,
      hideText
    ) => {
      const group = document.querySelector(groupSelector);
      if (group) {
        group.style.display = group.style.display === 'none' ? 'block' : 'none';
        button.textContent =
          group.style.display === 'block' ? hideText : showText;
      }
    };

    // Function to update button text based on the visibility of groups
    const updateHideCustomElemLabel = () => {
      const groups = [
        '.group[data-group="tools"]',
        '.group[data-group="event"]',
        '.group[data-group="activity"]'
      ];
      let anyVisible = false;

      groups.forEach((groupSelector) => {
        const group = document.querySelector(groupSelector);
        if (group && group.style.display !== 'none') {
          anyVisible = true;
        }
      });

      hideCustomElem.textContent = anyVisible
        ? 'General Functions ▲'
        : 'General Functions ▼';
    };

    const hideCustomElem = createButton(
      'hideCustomElem',
      'General Functions ▲',
      '100%',
      () => {
        const groups = [
          '.group[data-group="tools"]',
          '.group[data-group="event"]',
          '.group[data-group="activity"]'
        ];
        let anyVisible = false;

        groups.forEach((groupSelector) => {
          const group = document.querySelector(groupSelector);
          if (group) {
            if (group.style.display === 'block') {
              anyVisible = true;
            }
            group.style.display =
              group.style.display === 'block' ? 'none' : 'block';
          }
        });
        hideCustomElem.className = '';
        hideCustomElem.textContent = anyVisible
          ? 'General Functions ▼'
          : 'General Functions ▲';
      }
    );

    const stringToggleButton = createButton(
      'stringToggleButton',
      'String Functions ▼',
      '100%',
      function () {
        toggleGroupVisibility(
          '.group[data-group="stringOperations"]',
          this,
          'String Functions ▼',
          'String Functions ▲'
        );
      }
    );

    const dateTogglebtn = createButton(
      'dateTogglebtn',
      'Date Functions ▼',
      '100%',
      function () {
        toggleGroupVisibility(
          '.group[data-group="dateOperations"]',
          this,
          'Date Functions ▼ ',
          'Date Functions ▲'
        );
      }
    );

    // Insert hideCustomElem button first
    palette.insertBefore(hideCustomElem, palette.firstChild);

    // Insert tools and event groups right after hideCustomElem
    const toolsGroup = document.querySelector('.group[data-group="tools"]');
    const eventsGroup = document.querySelector('.group[data-group="event"]');
    if (toolsGroup)
      palette.insertBefore(toolsGroup, hideCustomElem.nextSibling);
    if (eventsGroup)
      palette.insertBefore(
        eventsGroup,
        toolsGroup ? toolsGroup.nextSibling : hideCustomElem.nextSibling
      );
    //remove <hr> line from panel
    if (toolsGroup.lastElementChild.tagName === 'HR') {
      toolsGroup.removeChild(toolsGroup.lastElementChild); // Remove the <hr> element
    }
    // Insert activity group after tools and event
    const activityGroup = document.querySelector(
      '.group[data-group="activity"]'
    );
    if (activityGroup)
      palette.insertBefore(
        activityGroup,
        eventsGroup ? eventsGroup.nextSibling : toolsGroup.nextSibling
      );

    // Insert String Functions button and its group
    palette.insertBefore(stringToggleButton, activityGroup.nextSibling);
    const stringOperationsGroup = document.querySelector(
      '.group[data-group="stringOperations"]'
    );
    if (stringOperationsGroup) {
      palette.insertBefore(
        stringOperationsGroup,
        stringToggleButton.nextSibling
      );
      stringOperationsGroup.style.display = 'none'; // Initially hide
    }

    // Insert Date Functions button and its group
    palette.insertBefore(
      dateTogglebtn,
      stringToggleButton.nextSibling.nextSibling
    );
    const dateOperationsGroup = document.querySelector(
      '.group[data-group="dateOperations"]'
    );
    if (dateOperationsGroup) {
      palette.insertBefore(dateOperationsGroup, dateTogglebtn.nextSibling);
      dateOperationsGroup.style.display = 'none'; // Initially hide
    }

    // Set initial visibility of groups and update button label
    const groups = [
      '.group[data-group="tools"]',
      '.group[data-group="event"]',
      '.group[data-group="activity"]'
    ];

    groups.forEach((groupSelector) => {
      const group = document.querySelector(groupSelector);
      if (group) {
        group.style.display = 'block'; // Ensure initial visibility
      }
    });

    // Update button label to reflect the current visibility state
    updateHideCustomElemLabel();
  }
};

export const removeDuplicateName = () => {
  const getAllElement = document.querySelectorAll('.djs-label');
  getAllElement.forEach((elem) => {
    if (
      elem.textContent.trim() === 'Filter Row ' ||
      elem.textContent.trim() === 'Start' ||
      elem.textContent.trim() === 'End'
    ) {
      const parentElement = elem.closest('.djs-element');
      if (parentElement) {
        parentElement.style.display = 'none';
      }
    }
  });
};

export const convertToMinutes = (dateTime) => {
  const minutesInMonth = Number(dateTime.month) * 30 * 24 * 60; // months to minutes
  const minutesInDays = Number(dateTime.days) * 24 * 60; // days to minutes
  const minutesInHours = Number(dateTime.hours) * 60; // hours to minutes
  const totalMinutes =
    minutesInMonth + minutesInDays + minutesInHours + Number(dateTime.minutes);

  return totalMinutes;
};

export const revertToFields = (totalMinutes) => {
  const minutesInMonth = 30 * 24 * 60;
  const minutesInDay = 24 * 60;
  const minutesInHour = 60;

  const month = Math.floor(totalMinutes / minutesInMonth);
  totalMinutes %= minutesInMonth;
  const days = Math.floor(totalMinutes / minutesInDay);
  totalMinutes %= minutesInDay;

  const hours = Math.floor(totalMinutes / minutesInHour);
  const minutes = totalMinutes % minutesInHour;

  return { month, days, hours, minutes };
};
export function getUniqueArrayList(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return []; // Ensure arr is an array

  return arr
    .reverse()
    .filter((item, index, self) => {
      return (
        item[key] && self.findIndex((obj) => obj[key] === item[key]) === index
      );
    })
    .reverse()
    .sort((a, b) => {
      if (!a.fieldInfoId) return 1;
      if (!b.fieldInfoId) return -1;
      return a.fieldInfoId - b.fieldInfoId;
    });
}
