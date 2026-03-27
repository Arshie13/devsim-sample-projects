# Key Takeaway

Production bugs in full-stack React + Express + PostgreSQL applications are different from development bugs—they affect real users and often involve complex data relationships that weren't apparent during testing. When reports show incorrect data, you need to trace the logic that generates the reports through your Express API and find where stale or inconsistent data is being used. This debugging process requires understanding the entire data flow from Prisma queries to React display.

**Why this is important:**

Production issues directly impact user trust and business operations, which makes fixing them urgent. A bug in development is theoretical—a bug in production has real consequences. Users might see incorrect information in their React frontend, make wrong decisions based on bad data, or lose confidence in your system entirely. In a library context managed with Prisma and PostgreSQL, a report showing the wrong number of overdue books might cause the library to make poor decisions about purchasing or staffing.

Understanding relationships across PostgreSQL tables helps identify the root cause, which is crucial for proper fixes. Reports often combine data from many tables through Prisma—the borrow records, the books, the members, the reservation queues. The bug might not be where it appears to be. A report showing wrong numbers might actually be pulling from the wrong table, or might be missing a JOIN condition that connects the right tables in your Prisma query.

Prisma datetime and timezone issues are common sources of production bugs that are hard to catch in testing. When storing dates in PostgreSQL with Prisma, timezone conversion can cause subtle issues—dates that appear correct in one timezone might be wrong in another. These subtle bugs are particularly tricky because everything seems to work most of the time, only failing when users in different timezones view the data.

Validating report accuracy prevents misinformation from reaching stakeholders, which protects business decisions. Your Express API generates reports based on Prisma queries against PostgreSQL—how many books are overdue, which books are most popular, how many new members joined this month. If reports are wrong because of incorrect Prisma queries or missing WHERE clauses, decisions will be wrong. Taking action based on bad data can waste resources or miss opportunities.

Production debugging is a crucial skill that every full-stack developer must develop. The ability to quickly identify and fix issues in live React, Express, PostgreSQL, and Prisma systems is what separates junior developers from senior ones.