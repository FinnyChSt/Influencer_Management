import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InfluencerService } from './influencer.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { FilterInfluencerDto } from './dto/filter-influencer.dto';

@Controller('influencer')
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  @Post()
  async create(@Body() createInfluencerDto: CreateInfluencerDto) {
    return await this.influencerService.createInfluencer(createInfluencerDto);
  }

  @Get()
  async find(@Query() filterDto: FilterInfluencerDto) {
    if (filterDto.firstName || filterDto.lastName) {
      return await this.influencerService.findByFilter(filterDto);
    }
    return await this.influencerService.findAll();
  }
}
