# Shuffle Quiz

Try it out: [https://shuffle-quiz.web.app/](https://shuffle-quiz.web.app/) !

## What is this?

**In one sentence**: students have 2 minutes to start answering a question after which their partial answer is randomly swapped ('shuffled') with another students' answer onto which they can keep building an answer.

**In a paragraph**: A teacher can create an online session (the 'game') containing a question for students. Students then join the game from their own devices and wait for the game to start. When it does, students get a few minutes to answer the teacher's question before their answer is 'shuffled' with another student's. Then, they can keep answering the question starting from where the other student had ended.

## Why this?

I built this tool as part of my Engineering Science undergrad thesis on engineering education! The thesis focused on understanding what causes professors to adopt new teaching techniques and this tool was a case study for this purpose.

The idea for this tool comes from instructor [Fernando Yánez](https://www.cs.toronto.edu/~fyanez/) who used a similar teaching technique in the past (although not online). The idea is that students learn better by seeing what other students are doing, while the online anonimity allows students to answer without the fear of judgment.

## License

All this code is available under the MIT License (see `LICENSE`) with the following additional restrictions:

1. Code under `src/components/lexical/` was largely taken from the [Lexical](lexical.dev/) library and hence belongs to Meta (also under the MIT License, see `LICENSE` in that folder).

2. Icons under `public/avatars/` belong to [Jefferson Cheng](https://jeffersoncheng.com/Anonymous-Animals) and/or Google and the copyright is entirely theirs. See `LICENSE` in that folder. Thank you to [@wayou](https://github.com/wayou/anonymous-animals/tree/master) for compiling these icons.

## Security: anonymous but public!

This tool is completly anonymous, however this also means that what is submitted is technically publicly accessible (it would be difficult to restrict access to content without having user 'accounts'). I haven't made it easy to access the database, but if someone figures out how, there's nothing preventing them from doing so. So don't submit anything confidential!