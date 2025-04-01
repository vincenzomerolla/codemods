import { dag, type Container, object, func, Directory } from "@dagger.io/dagger";

@object()
export class Codemods {
  @func()
  async emotionToStylex(
    source: Directory
  ): Promise<string[]> {
    return source.entries()
  }
}
