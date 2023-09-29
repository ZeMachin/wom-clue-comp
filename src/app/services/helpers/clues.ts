import { ClueGains } from "src/app/models/hiscore.model";
import { PlayerGains } from "src/app/models/player-gains.model";
import { CLUE_WEIGHTS } from "src/app/shared/constants";

export const clueDetailsToGains = (playerDetails: PlayerGains): ClueGains => {
    const gains: ClueGains = {
      beginner: playerDetails.data.activities.clue_scrolls_beginner.score.gained,
      easy: playerDetails.data.activities.clue_scrolls_easy.score.gained,
      medium: playerDetails.data.activities.clue_scrolls_medium.score.gained,
      hard: playerDetails.data.activities.clue_scrolls_hard.score.gained,
      elite: playerDetails.data.activities.clue_scrolls_elite.score.gained,
      master: playerDetails.data.activities.clue_scrolls_master.score.gained,
    }

    gains.total = getClueScore(gains);

    return gains;
  }

const getClueScore = (gains: ClueGains): number => {
    return gains.beginner * CLUE_WEIGHTS.beginner + gains.easy * CLUE_WEIGHTS.easy + gains.medium * CLUE_WEIGHTS.medium + gains.hard * CLUE_WEIGHTS.hard + gains.elite * CLUE_WEIGHTS.elite + gains.master * CLUE_WEIGHTS.master;
}