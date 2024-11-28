import { Group } from "@prisma/client";
import { CreateGroupAttributes, GroupsRepository } from "../GroupsRepository";
import { prisma } from "../../database";

export class PrismaGroupsRepository implements GroupsRepository {
  find (): Promise<Group[]> {
    return prisma.group.findMany()
  }

  findById (id: number): Promise<Group | null> {
    return prisma.group.findUnique({ where: { id: id }})
  }

  create (attributes: CreateGroupAttributes): Promise<Group> {
    return prisma.group.create({ data: attributes })
  }

  updateById (id: number, attributes: Partial<CreateGroupAttributes>): Promise<Group | null> {
    return prisma.group.update({ 
      where: { id },
      data: attributes
    })
  }

  deleteById (id: number): Promise<Group | null> {
    return prisma.group.delete({where: { id }})
  }

  addLead (groupId: number, leadId: number): Promise<Group> {
    return prisma.group.update({
      where: { id: groupId },
      data: {
        Leads: {
          connect: { id: leadId }
        }
      },
      include: {
        Leads: true
      }
    })
  }

  removeLead (groupId: number, leadId: number): Promise<Group> {
    return prisma.group.update({
      where: {
        id: groupId
      },
      data: {
        Leads: {
          disconnect: {id: leadId}
        }
      },
      include: {
        Leads: true
      }
    })
  }
}