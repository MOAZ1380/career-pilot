import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Temporary until JWT is added
  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(this.userId, dto);
  }

  @Get()
  findMe() {
    return this.profileService.findMe(this.userId);
  }

  @Patch()
  update(@Body() dto: UpdateProfileDto) {
    return this.profileService.update(this.userId, dto);
  }

  @Delete()
  remove() {
    return this.profileService.remove(this.userId);
  }
}
