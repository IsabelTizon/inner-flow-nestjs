//  INJECTABLE
import { Injectable } from '@nestjs/common'; // it is a decorator used to mark a class as a provider, allowing it to be injected into controllers.

// ERRORS
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

// DTOS
import { createPoseDto, updatePoseDto } from '../dtos/pose.dto'; // classes for data transfer objects for creating and updating poses

// OpenAI
import { DescriptionService } from './description.service'; // OpenAI service to interact with the OpenAI API for generating pose descriptions

// DDBB: MODELS
import { Poses } from '../models/poses.model'; // structure of the poses table in the DDBB
/// DDBB: SQLITE3
import * as sqlite3 from 'sqlite3'; // SQLite3 library for interacting with the SQLite database
import { Repository } from 'typeorm'; // TYPEORM
import { InjectRepository } from '@nestjs/typeorm';

// export interface Poses {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
// }

@Injectable()
export class PosesService {
  constructor(
    private readonly description: DescriptionService,
    @InjectRepository(Poses)
    // PosesRepository for interactiion with the database
    private readonly posesRepository: Repository<Poses>,
  ) {
    this.database = new sqlite3.Database('yogaDDBB.sqlite', (error) => {
      if (error) {
        console.error('Error opening yoga DDBB:');
        return;
      }

      this.database.run(
        `CREATE TABLE IF NOT EXISTS poses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL
        )
        `,
        (error) => {
          if (error) {
            console.error('Error creating poses table:', error);
            return;
          }
          console.log('poses table on yoga DDBB was correctly created');
        },
      );
    });
  }

  // private posesDDBB: Poses[] = [];
  private database: sqlite3.Database;
  // private descriptionService: DescriptionService;

  // GET ALL THE POSES
  async getAll(): Promise<Poses[]> {
    return this.posesRepository.find();
    // return new Promise((resolve, reject) => {
    //   this.database.all(`SELECT * FROM poses`, [], (err, rows) => {
    //     if (err) {
    //       console.error('Error retrieving all poses:', err);
    //       return reject(err);
    //     }
    //     resolve(rows as Poses[]);
    //   });
    // });
  }

  // GET ONE POSE BY ID
  async getOne(id: string): Promise<Poses> {
    console.log(`Getting pose with id: ${id}`);

    return this.posesRepository.findOneOrFail({ where: { id: id } });

    // return new Promise((resolve, reject) => {
    //   this.database.get(
    //     `SELECT * FROM poses WHERE id = ?`,
    //     [id],
    //     (error, row) => {
    //       if (error) {
    //         console.error('Error fetching pose from database:', error);
    //         return reject(
    //           new NotFoundException(`Pose with id ${id} not found`),
    //         );
    //       }

    //       if (!row) {
    //         return reject(
    //           new NotFoundException(`Pose with id ${id} not found`),
    //         );
    //       }

    //       resolve(row as Poses);
    //     },
    //   );
    // });
  }

  // CREATE A NEW POSE
  async addPose(poseDto: createPoseDto): Promise<Poses> {
    const description =
      // if poseDto.description exists,  we check if it contains non-whitespace characters using trim().
      // If the condition is met, we return the existing description.
      // Otherwise, we generate one dynamically using createDescription(poseDto) with OpenAI assistance.
      poseDto.description && poseDto.description.trim()
        ? poseDto.description
        : await this.description.createDescription(poseDto);

    const newPose = this.posesRepository.create({
      ...poseDto,
      description,
    });

    await this.posesRepository.save(newPose);
    return newPose;
    // const newPose: Poses = {
    //   id: uuidv4(),
    //   name: poseDto.name,
    //   image: poseDto.image,
    //   description,
    // };

    // return new Promise((resolve, reject) => {
    //   this.database.run(
    //     `INSERT INTO poses (id, name, description, image) VALUES (?, ?, ?, ?)`,
    //     [newPose.id, newPose.name, newPose.description, newPose.image],
    //     (err) => {
    //       if (err) {
    //         console.error('Error inserting pose:', err);
    //         return reject(err);
    //       }
    //       resolve(newPose);
    //     },
    //   );
    // });
  }

  //DELETE A POSE BY ID
  async delete(id: string): Promise<void> {
    await this.posesRepository.delete(id);
    // return new Promise((resolve, reject) => {
    //   this.database.run(`DELETE FROM poses WHERE id = ?`, [id], function (err) {
    //     if (err) {
    //       return reject(
    //         new NotFoundException(`Error deleting pose with id ${id}`),
    //       );
    //     }
    //     if (this.changes === 0) {
    //       return reject(new NotFoundException(`Pose with id ${id} not found`));
    //     }
    //     resolve();
    //   });
    // });
  }

  // UPDATE A POSE BY ID
  async update(id: string, poseDto: updatePoseDto): Promise<void> {
    const existingPose = await this.posesRepository.findOne({ where: { id } });

    if (!existingPose) {
      throw new NotFoundException(`Pose with id ${id} not found`);
    }

    if (!poseDto.name || !poseDto.image) {
      throw new BadRequestException(
        'Name and image are required to generate a description',
      );
    }

    const updatedDescription = poseDto.description?.trim()
      ? poseDto.description
      : await this.description.createDescription({
          name: poseDto.name,
          image: poseDto.image,
          description: '',
        });

    await this.posesRepository.update(id, {
      name: poseDto.name ?? existingPose.name,
      description: updatedDescription,
      image: poseDto.image ?? existingPose.image,
    });

    // const { name, description, image } = poseDto;
    // return new Promise((resolve, reject) => {
    //   this.database.run(
    //     `UPDATE poses SET name = ?, description = ?, image = ? WHERE id = ?`,
    //     [name, description, image, id],
    //     function (err) {
    //       if (err) {
    //         return reject(err);
    //       }
    //       if (this.changes === 0) {
    //         return reject(
    //           new NotFoundException(`Pose with id ${id} not found`),
    //         );
    //       }
    //       resolve();
    //     },
    //   );
    // });
  }

  // SEARCH POSES BY NAME
  searchByName(name: string): Promise<Poses[]> {
    const normalizedName = name
      .trim()
      .replace(/[-\s]+/g, ' ')
      .toLowerCase();

    return new Promise((resolve, reject) => {
      this.database.all(`SELECT * FROM poses`, [], (err, rows) => {
        if (err) return reject(err);

        const results = (rows as Poses[]).filter((pose) =>
          pose.name
            .trim()
            .replace(/[-\s]+/g, ' ')
            .toLowerCase()
            .includes(normalizedName),
        );
        resolve(results);
      });
    });
  }
}
