import { Campaign } from "@prisma/client";
import { AddLeadToCampaignAttributes, CampaignsRepository, CreateCampaignAttributes } from "../CampaignsRepository";
import { prisma } from "../../database";
import { HttpError } from "../../errors/HttpError";

export class PrismaCampaignsRepository implements CampaignsRepository{
  find (): Promise<Campaign[]> {
    return prisma.campaign.findMany()
  }

  findById (id: number): Promise<Campaign | null> {
    return prisma.campaign.findUnique({
      where: {id},
      include: {
        leads: {
          include: {
            lead: true
          }
        }
      }
    })
  }

  create (attributes: CreateCampaignAttributes): Promise<Campaign> {
    return prisma.campaign.create({
      data: attributes
    })
  }

  async updateById (id: number, attributes: Partial<CreateCampaignAttributes>): Promise<Campaign | null> {
    const campaignExists = await prisma.campaign.findUnique({where: { id }})
    if(!campaignExists) return null
    return prisma.campaign.update({
      where: {id},
      data: attributes
    })
  }

  async deleteById (id: number): Promise<Campaign | null> {
    const campaignExists = await prisma.campaign.findUnique({where: { id }})
    if(!campaignExists) return null
    return prisma.campaign.delete({
      where: { id }
    })
  }

  async addLead(attributes: AddLeadToCampaignAttributes): Promise<void> {
    await prisma.leadCampaign.create({ data: attributes })
  }

  async updateLeadStatus (attributes: AddLeadToCampaignAttributes): Promise<void> {
    await prisma.leadCampaign.update({
      data: attributes,
      where: {
        leadId_campaignId: {
          campaignId: attributes.campaignId,
          leadId: attributes.leadId
        }
      }
    })
  }

  async removeLead (campaignId: number, leadId: number): Promise<void> {
    await prisma.leadCampaign.delete({
      where: {
        leadId_campaignId: { campaignId, leadId }
      }
    })
  }
}