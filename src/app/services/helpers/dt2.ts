import { DT2Gains } from "src/app/models/hiscore.model";
import { PlayerGains } from "src/app/models/player-gains.model";
import { DT2_WEIGHTS } from "src/app/shared/constants";

export const DT2DetailsToGains = (playerDetails: PlayerGains): DT2Gains => {
    const gains: DT2Gains = {
      vardorvis: playerDetails.data.bosses.vardorvis.kills.gained,
      duke: playerDetails.data.bosses.duke_sucellus.kills.gained,
      leviathan: playerDetails.data.bosses.the_leviathan.kills.gained,
      whisperer: playerDetails.data.bosses.the_whisperer.kills.gained,
    }

    gains.total = getDT2Score(gains);

    return gains;
  }

const getDT2Score = (gains: DT2Gains): number => {
    return gains.vardorvis * DT2_WEIGHTS.vardorvis + gains.vardorvis * DT2_WEIGHTS.vardorvis + gains.vardorvis * DT2_WEIGHTS.vardorvis + gains.vardorvis * DT2_WEIGHTS.vardorvis;
}