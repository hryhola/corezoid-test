type TestFunction = () => void;

interface Test {
    description: string;
    testFn: TestFunction;
}

let tests: Test[] = [];
let failed: string[] = []
let currentDescribe = ''

export const describe = (description: string, callback: () => void) => {
    currentDescribe = description
    tests = []
    console.log(`\n${description}`);
    callback();
    runTests()
};

export const it = (description: string, testFn: TestFunction) => {
    tests.push({ description, testFn });
};

export const runTests = () => {
    tests.forEach(({ description, testFn }) => {
        try {
            testFn();
            console.log(`✓ ${description}`);
        } catch (error) {
            const failedText = `✗ ${description}\n\t${error}`
            failed.push(currentDescribe + '\n\t' +failedText)
            console.error(failedText);
        }
    });
};

export const printFailed = () => {
    if (!failed.length) return

    console.log('\n\nAll failed tests:')
    for (const f of failed) {
        console.log(f)
    }
}