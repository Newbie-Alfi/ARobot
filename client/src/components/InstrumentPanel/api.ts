import axios from "axios";
import { BACKEND_URL } from "../../config";

function createInstrumentAPI() {
  function get() {
    return axios.get(BACKEND_URL + "/instruments/");
  }

  return { get };
}

export const instrumentAPI = createInstrumentAPI();
