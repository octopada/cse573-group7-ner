let svg;
let width, height;

let tooltipDiv;
const toolTipOffset = {left: 120, top: 345};

let baseX = 16;
let baseY = 48;
let currX = 16;
let currY = 48;
let wordCount = 0;

document.addEventListener('DOMContentLoaded', function () {
    svg = d3.select("#classifiedTextSVG");
    width = +svg.style('width').replace('px', '');
    height = +svg.style('height').replace('px', '');

    tooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
});

function nerClassify() {
    currX = baseX;
    currY = baseY;
    svg.selectAll('*').remove();
    wordCount = 0;

    let textArea = document.getElementById("classifyTexts");
    let modelSelect = document.getElementById("modelSelect");
    let modSelect = document.getElementById("modSelect");

    let requestBody = JSON.stringify({
        text: textArea.value,
        model: modelSelect.value,
        modifier: modSelect.value
    });

    console.log(requestBody)

    fetch('/classify', {
        method: 'post',
        body: requestBody,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json();
        }).then(function (data) {
        console.log('POST response:');
        console.log(data['result']);

        let taggedLocatedWords = []
        let previousLetterCount = 0;
        for (let idx in data['result']) {
            let taggedWord = data['result'][idx];

            let location = getWordLocation(previousLetterCount)

            let taggedLocatedWord = {}
            taggedLocatedWord.word = taggedWord['word'];
            taggedLocatedWord.tag = taggedWord['tag'];
            taggedLocatedWord.x = location.x;
            taggedLocatedWord.y = location.y;

            taggedLocatedWords.push(taggedLocatedWord);

            // console.log("appending");
            // svg.append('text')
            //     .attr('x', location.x)
            //     .attr('y', location.y)
            //     .style('font', '48px courier')
            //     .style("fill", "blue")
            //     .text(taggedWord['word']);

            wordCount++;
            previousLetterCount = taggedWord['word'].length;
        }

        console.log(taggedLocatedWords);

        svg.append('g')
            .selectAll('rect')
            .data(taggedLocatedWords)
            .join('rect')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .style('fill', d => getHighlightColor(d.tag))
            .style('opacity', '1');

        svg.append('g')
            .style('font', '48px courier')
            .style('fill', 'black')
            .selectAll('text')
            .data(taggedLocatedWords)
            .join('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .text(d => d.word)
            .on('mouseover', function (d) {
                tooltipDiv.html("Tag: " + d.tag + " - " + resolveTag(d.tag))
                    .style("opacity", 1)
                    .style("background", getHighlightColor(d.tag));
            })
            .on('mousemove', function (d) {
                tooltipDiv.style("left", (d.x + d.bbox.width + toolTipOffset.left) + "px")
                    .style("top", (d.y + d.bbox.height + toolTipOffset.top) + "px");
            })
            .on('mouseout', function () {
                tooltipDiv.style("opacity", 0);
            });

        svg.selectAll("text")
            .each(function (d) {
                d.bbox = this.getBBox();
            });

        const xMargin = 4
        const yMargin = 0
        svg.selectAll("rect")
            .data(taggedLocatedWords)
            .join("rect")
            .attr("width", d => d.bbox.width + 2 * xMargin)
            .attr("height", d => d.bbox.height + 2 * yMargin)
            .attr('transform', function (d) {
                return `translate(-${xMargin}, -${d.bbox.height * 0.8 + yMargin})`
            });
    });
}

function resolveTag(tag) {
    switch (tag) {
        case 'PER':
            return 'Person';
        case 'ORG':
            return 'Organization';
        case 'LOC':
            return 'Location';
        case 'MISC':
            return 'Miscellaneous Name';
        case 'O':
            return 'Other';
    }
}

function getHighlightColor(tag) {
    switch (tag) {
        case 'PER':
            return '#F2BAC9';
        case 'ORG':
            return '#BAD7F2';
        case 'LOC':
            return '#F2E2BA';
        case 'MISC':
            return '#B0F2B4';
        case 'O':
            return 'white';
    }
}

function getWordLocation(previousLetterCount) {
    let location = {
        x: currX,
        y: currY
    };

    if (wordCount === 0) {
        return location;
    }

    currX += (28 * previousLetterCount) + 20;
    if (currX > 1400) {
        currX = baseX;
        currY += (currY + 12);
    }

    location.x = currX;
    location.y = currY;
    return location;
}