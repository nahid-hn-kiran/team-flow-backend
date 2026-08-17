import { Prisma } from "../../../generated/prisma/client";
import {
  ActivityAction,
  ActivityEntity,
} from "../../../generated/prisma/enums";

export interface ICreateActivityPayload {
  action: ActivityAction;
  entityType: ActivityEntity;
  entityId: string;

  workspaceId: string;
  projectId?: string;
  taskId?: string;

  performedBy: string;

  description: string;
  metadata?: Prisma.InputJsonValue;
}
