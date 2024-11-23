import { Handler } from "express";
import { prisma } from "../database";
import { CreateGroupsRequestSchema, UpdateGroupRequestSchema } from "./schemas/GroupsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class GroupsController {
  index: Handler = async (req, res, next) => {
    try {
      const groups = await prisma.group.findMany()
      res.json(groups)
    } catch (error) {
      next(error)
    }
  }

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupsRequestSchema.parse(req.body)
      const newGroup = await prisma.group.create({ data: body })
      res.status(201).json({ newGroup })

    } catch (error) {
      next(error)
    }
  }

  show: Handler = async (req, res, next) => {
    try {
      const group = await prisma.group.findUnique({
        where: { id: Number(req.params.id) },
        include: { Leads: true }
      })

      if (!group) throw new HttpError(404, "Group not found.")

      res.json(group)
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const body = UpdateGroupRequestSchema.parse(req.body)

      const groupExists = await prisma.group.findUnique({ where: { id } })
      if (!groupExists) throw new HttpError(404, 'Group not exists or has already been deleted.')

      const updatedGroup = await prisma.group.update({
        data: body,
        where: { id }
      })

      res.json({ updatedGroup })
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const groupExists = await prisma.group.findUnique({ where: { id } })
      if (!groupExists) throw new HttpError(404, 'Group not exists or has already been deleted.')

      const deletedGroup = await prisma.group.delete({ where: { id } })

      res.json({ deletedGroup })
    } catch (error) {
      next(error)
    }
  }

}