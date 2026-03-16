/**
 * @file api.js
 * @description Barrel re-export — backwards compatibility.
 * All logic now lives in individual service files.
 */
import * as coursesService     from "./courses.service";
import * as enrollmentsService from "./enrollments.service";
import * as qaService          from "./qa.service";
import * as analyticsService   from "./analytics.service";
import * as usersService       from "./users.service";
import * as marketersService   from "./marketers.service";

export const api = {
  ...coursesService,
  ...enrollmentsService,
  ...qaService,
  ...analyticsService,
  ...usersService,
  ...marketersService,
};
