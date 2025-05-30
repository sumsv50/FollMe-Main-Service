import { Body, Controller, Get, Request, Post, UseGuards, Param, Query } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateInvitationDTO } from './dtos/createInvitation.dto';

@Controller('api')
export class invitationsController {
  constructor(private readonly invitationsService: InvitationsService) { }

  @Get('/events')
  @UseGuards(AuthGuard("jwt"))
  async getAllInvitations(
    @Request() req,
    @Query('page') page: number,
  ) {
    page = Number(page) || 1;
    const invitations = await this.invitationsService.getList(req.user._id, page);
    return { invitations };
  }

  @Post('/events')
  @UseGuards(AuthGuard("jwt"))
  async createEvent(
    @Request() req,
    @Body() body: CreateInvitationDTO,
  ) {
    const res = await this.invitationsService.createOne(body, req.user._id, req.user.slEmail);
    return res;
  }

  @Get('events/:id')
  @UseGuards(AuthGuard("jwt"))
  async getEvent(
    @Request() req,
    @Param() params
  ) {
    const invitationId = params.id;
    const invitation = await this.invitationsService.findOne(invitationId, req.user._id);
    return { invitation };
  }

  @Get('invitations/:id')
  async getInvitation(
    @Param() params
  ) {
    const invitationId = params.id;
    const invitation = await this.invitationsService.findGuest(invitationId);
    return { invitation };
  }
}
