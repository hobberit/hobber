import { getHobbyById } from "@/services/hobbies";
import { listEquipmentForHobby } from "@/services/equipment";
import { listRoadmapForHobby } from "@/services/roadmaps";
import { listResourcesForHobby } from "@/services/resources";
import { listMilestonesForHobby } from "@/services/milestones";
import type {
  EquipmentItem,
  Hobby,
  Milestone,
  Resource,
  Roadmap,
} from "@/types";

export interface HobbyGuide {
  hobby: Hobby;
  equipment: EquipmentItem[];
  roadmap: Roadmap[];
  resources: Resource[];
  milestones: Milestone[];
}

/** Everything the Hobby Starter Guide screen needs for one hobby, fetched in parallel. */
export async function getHobbyGuide(hobbyId: string): Promise<HobbyGuide | null> {
  const [hobby, equipment, roadmap, resources, milestones] = await Promise.all([
    getHobbyById(hobbyId),
    listEquipmentForHobby(hobbyId),
    listRoadmapForHobby(hobbyId),
    listResourcesForHobby(hobbyId),
    listMilestonesForHobby(hobbyId),
  ]);

  if (!hobby) return null;
  return { hobby, equipment, roadmap, resources, milestones };
}
