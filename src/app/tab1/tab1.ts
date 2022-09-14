export const MESSAGETEXT = {
  presetnotExist: 'Preset does not exist',
  fillAll: 'All field need to be filled.',
  stored: 'Your preset stored successfully.',
  fillBothField: 'Both field for the between range has to be valid.',
  savedFilter: 'This preset is already saved already',
  updateCurrentFilter: 'Your are updating the current filter',
  filterUpdated: 'Your preset updated successfully.',
  confirmeToDeletePreset: 'Are you sure to delete :',
  presetSuccefullDeleted: 'is deleted successfully.',
  confimeToClearUnsavedPreset:
    'Do you want to clear preset including your unsaved changes :',
  confireToclearSavedPreset: 'Do you want to clear the current preset',
  discardChanges: 'Do you want to discard the current filter changes',
  removingRow: 'Are you sure to remove this row',
  durationNotification: 'The Duration should be HH MM SS and 24h clock.',
  headerNotification: 'Please check the form.',
  existPreset: 'Preset already exists.',
  chekNamePreset: 'Please check the preset name',
  FillThirdField: 'Please fill out the third field!',
};

export const SUB_MENU_DATE_ID = {
  SUB_MENU_BETWEEN_ID: 'BETWEEN',
  SUB_MENU_EXACTLY_ID: 'EXACTLY',
  SUB_MENU_BEFORE_ID: 'BEFORE',
  SUB_MENU_AFTER_ID: 'AFTER',
};

const SUB_MENU_TEXT_TYPE_BASE = [
  {
    id: 'CONTAINS',
    name: 'Contains',
  },
  {
    id: 'IS',
    name: 'Is',
  },
  {
    id: 'IS_NOT',
    name: 'Is Not',
  },
];

const SUB_MENU_TEXT_TYPE_BEGIN_END = [
  {
    id: 'BEGIN_WITH',
    name: 'Begin With',
  },
  {
    id: 'ENDS_WITH',
    name: 'Ends With',
  },
];
const SUB_MENU_TEXT_TYPE_CONTAINS_WORDS = [
  {
    id: 'CONTAINS_WORDS',
    name: 'Contains Words',
  },
];
const SUB_MENU_DATE_TYPE_BASE = [
  {
    id: SUB_MENU_DATE_ID.SUB_MENU_EXACTLY_ID,
    name: 'Exactly',
  },
  {
    id: SUB_MENU_DATE_ID.SUB_MENU_BEFORE_ID,
    name: 'Before',
  },
  {
    id: SUB_MENU_DATE_ID.SUB_MENU_AFTER_ID,
    name: 'After',
  },
  {
    id: SUB_MENU_DATE_ID.SUB_MENU_BETWEEN_ID,
    name: 'Between',
  },
];
const SUB_MENU_DURATION_TYPE_BASE = [
  {
    id: 'LONGER_THAN',
    name: 'Longer Than',
  },
  {
    id: 'SHORTER_THAN',
    name: 'Shorter Than',
  },
  {
    id: 'SHOW_TOTAL_DURATION',
    name: 'Show Total Duration',
  },
];

export const SEARCHDATA = [
  {
    id: 'CLIP_NOTES',
    name: 'Clip Notes',
    type: 'text',
    subMenu: [
      ...SUB_MENU_TEXT_TYPE_BASE,
      ...SUB_MENU_TEXT_TYPE_BEGIN_END,
      ...SUB_MENU_TEXT_TYPE_CONTAINS_WORDS,
    ],
  },
  {
    id: 'FRAME_NOTES',
    name: 'Frame Notes',
    type: 'text',
    subMenu: [
      ...SUB_MENU_TEXT_TYPE_BASE,
      ...SUB_MENU_TEXT_TYPE_BEGIN_END,
      ...SUB_MENU_TEXT_TYPE_CONTAINS_WORDS,
    ],
  },
  {
    id: 'TRANSCRIPTS',
    name: 'Transcripts',
    type: 'text',
    subMenu: [
      ...SUB_MENU_TEXT_TYPE_BASE,
      ...SUB_MENU_TEXT_TYPE_BEGIN_END,
      ...SUB_MENU_TEXT_TYPE_CONTAINS_WORDS,
    ],
  },
  {
    id: 'FILE_NAME',
    name: 'File Name',
    type: 'text',
    subMenu: [...SUB_MENU_TEXT_TYPE_BASE, ...SUB_MENU_TEXT_TYPE_BEGIN_END],
  },
  {
    id: 'DURATION',
    name: 'Duration',
    type: 'time',
    subMenu: SUB_MENU_DURATION_TYPE_BASE,
  },
  {
    id: 'CARD_SERIAL',
    name: 'Card Serial',
    type: 'text',
    subMenu: SUB_MENU_TEXT_TYPE_BASE,
  },
  {
    id: 'RECORDER_SERIAL',
    name: 'Recorder Serial',
    type: 'text',
    subMenu: SUB_MENU_TEXT_TYPE_BASE,
  },
  {
    id: 'SHOOTING_DATE',
    name: 'Shooting Date',
    type: 'date',
    subMenu: SUB_MENU_DATE_TYPE_BASE,
  },
  {
    id: 'CREATION_DATE',
    name: 'Creation Date',
    type: 'date',
    subMenu: SUB_MENU_DATE_TYPE_BASE,
  },
  {
    id: 'MODIFICATION_DATE',
    name: 'Modification Date',
    type: 'date',
    subMenu: SUB_MENU_DATE_TYPE_BASE,
  },
];
