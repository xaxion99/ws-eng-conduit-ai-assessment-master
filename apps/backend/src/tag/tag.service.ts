import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Tag } from './tag.entity';
import { ITagsRO } from './tag.interface';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
    private readonly em: EntityManager
  ) {}

  async findAll(): Promise<ITagsRO> {
    const tags = await this.tagRepository.findAll();
    return { tags: tags.map((tag) => tag.tag) };
  }

  // New method to check if a tag is already in the database and if not to create a new tag
  async findOrCreate(tagName: string): Promise<Tag> {
    let t = await this.em.findOne(Tag, { tag: tagName });
    if (!t) {
      t = this.em.create(Tag, { tag: tagName });
      this.em.persist(t);
      await this.em.flush();
    }
    return t;
  }
  // End Modification
}
