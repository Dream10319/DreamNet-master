import { createSlice } from "@reduxjs/toolkit";

interface IinitialState {
  isToggled: boolean;
  isOpenEventModal: boolean;
  eventType: null | "project" | "rental" | "organisation";
  eventId: null | number;
}

const initialState: IinitialState = {
  isToggled: false,
  isOpenEventModal: false,
  eventType: null,
  eventId: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsToggled: (state, action) => {
      state.isToggled = action.payload;
    },
    setIsOpenEventModal: (state, action) => {
      state.isOpenEventModal = action.payload;
    },
    setEventData: (state, action) => {
      const { eventId, eventType } = action.payload;
      state.eventId = eventId;
      state.eventType = eventType;
    },
  },
});

export const { setIsToggled, setIsOpenEventModal, setEventData } = appSlice.actions;

export default appSlice.reducer;
